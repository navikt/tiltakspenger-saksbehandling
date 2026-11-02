import type { BenkRequestBody } from '~/lib/benk/typer/felles';
import { BenkBehandlingsstatus } from '~/lib/benk/typer/felles';
import { BenkTab } from '~/lib/benk/typer/tabs';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    SAKSBEHANDLER_IDENT,
    test,
} from '../felles/e2eFelles';
import {
    forventBenkQuery,
    lagAntallPerTab,
    lagBenkOversikt,
    lagBenkRespons,
    lagBenkRevurdering,
    lagBenkSøknadsbehandling,
    lagBenkSøknadsbehandlingUtenTilgang,
    settBenkCookie,
    standardSøknaderFilter,
} from './benkTestUtils';

const standardRevurderingerFilter = {
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    beskyttelse: null,
    saksbehandler: null,
    status: null,
    resultat: null,
};

const antallPerTab = lagAntallPerTab({
    MINE: 1,
    [BenkTab.SØKNADER]: 2,
    [BenkTab.REVURDERINGER]: 1,
    [BenkTab.MELDEKORT]: 3,
    [BenkTab.KLAGE]: 4,
    [BenkTab.TILBAKEKREVING]: 5,
});

const søknadsrader = [lagBenkSøknadsbehandling(), lagBenkSøknadsbehandlingUtenTilgang()];

test.describe('Benken - faner, filtrering, sortering og paginering', () => {
    test('viser køfanene med antall og sender standardfilteret til backend', async ({
        page,
        msw,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(
                        BenkTab.SØKNADER,
                        lagBenkOversikt(søknadsrader, {
                            totalAntallUfiltrert: 7,
                            oppsummering: {
                                antallMedTilgang: 1,
                                antallUtenTilgang: 1,
                                antallSkjermet: 1,
                                antallKode6: 0,
                                antallKode7: 0,
                            },
                        }),
                        { antallPerTab },
                    ),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        for (const fane of [
            'Mine behandlinger (1)',
            'Søknader (2)',
            'Revurderinger (1)',
            'Meldekort (3)',
            'Klage (4)',
            'Tilbakekreving (5)',
        ]) {
            await expect(page.getByRole('tab', { name: fane })).toBeVisible();
        }
        await expect(page.getByRole('tab', { name: 'Søknader (2)' })).toHaveAttribute(
            'aria-selected',
            'true',
        );

        await expect(
            page.getByText('2 av totalt 7 behandlinger matcher valgte filtre'),
        ).toBeVisible();
        await expect(page.getByText('1 uten tilgang (herav 1 skjermet)')).toBeVisible();

        await expect(page.getByRole('link', { name: '12345678911' })).toHaveAttribute(
            'href',
            '/sak/202501011001',
        );
        await expect(page.getByText('[Fnr sladdet]')).toBeVisible();

        expect(søknadKall).toEqual([
            { sortering: 'kravtidspunkt,ASC', filters: standardSøknaderFilter(), side: 0 },
        ]);
    });

    test('bytte av fane henter revurderinger og oppdaterer URL-en', async ({ page, msw }) => {
        const revurderingKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', () =>
                HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader), {
                        antallPerTab,
                    }),
                ),
            ),
            http.post('*/benk/revurderinger', async ({ request }) => {
                revurderingKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.REVURDERINGER, lagBenkOversikt([lagBenkRevurdering()]), {
                        antallPerTab,
                    }),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('tab', { name: 'Revurderinger (1)' }).click();

        await expect(page.getByRole('tab', { name: 'Revurderinger (1)' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        await expect(page.getByRole('link', { name: '22222222222' })).toBeVisible();
        await forventBenkQuery(page, { tab: 'REVURDERINGER' });

        expect(revurderingKall).toEqual([
            { sortering: 'startet,ASC', filters: standardRevurderingerFilter, side: 0 },
        ]);
    });

    test('statusfilteret tas i bruk med «Oppdater filtre» og legges i URL-en', async ({
        page,
        msw,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader)),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByLabel('Status').selectOption({ label: 'Klar til behandling' });
        // Lokale filtre tas ikke i bruk før skjemaet sendes inn
        expect(søknadKall).toHaveLength(1);

        await page.getByRole('button', { name: 'Oppdater filtre' }).click();

        await forventBenkQuery(page, { tab: 'SØKNADER', status: 'KLAR_TIL_BEHANDLING' });
        await expect.poll(() => søknadKall.length).toBe(2);
        expect(søknadKall[1]).toEqual({
            sortering: 'kravtidspunkt,ASC',
            filters: standardSøknaderFilter({ status: BenkBehandlingsstatus.KLAR_TIL_BEHANDLING }),
            side: 0,
        });
        await expect(page.getByLabel('Status')).toHaveValue('KLAR_TIL_BEHANDLING');
    });

    test('«Vis kun saker tildelt meg» filtrerer på innlogget saksbehandler', async ({
        page,
        msw,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader)),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        const kunTildeltMeg = page.getByRole('button', { name: 'Vis kun saker tildelt meg' });
        await expect(kunTildeltMeg).toHaveAttribute('aria-pressed', 'false');

        await kunTildeltMeg.click();

        await forventBenkQuery(page, { tab: 'SØKNADER', kunTildeltMeg: 'true' });
        await expect(kunTildeltMeg).toHaveAttribute('aria-pressed', 'true');
        expect(søknadKall.at(-1)).toEqual({
            sortering: 'kravtidspunkt,ASC',
            filters: standardSøknaderFilter({ saksbehandler: SAKSBEHANDLER_IDENT }),
            side: 0,
        });
    });

    test('klikk på kolonneoverskrift sorterer stigende og så synkende', async ({ page, msw }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader)),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('button', { name: 'Sist endret' }).click();
        await forventBenkQuery(page, { sortering: 'sist_endret,ASC' });
        await expect.poll(() => søknadKall.at(-1)?.sortering).toBe('sist_endret,ASC');
        await expect(page.getByRole('columnheader', { name: 'Sist endret' })).toHaveAttribute(
            'aria-sort',
            'ascending',
        );

        await page.getByRole('button', { name: 'Sist endret' }).click();
        await forventBenkQuery(page, { sortering: 'sist_endret,DESC' });
        await expect.poll(() => søknadKall.at(-1)?.sortering).toBe('sist_endret,DESC');
        await expect(page.getByRole('columnheader', { name: 'Sist endret' })).toHaveAttribute(
            'aria-sort',
            'descending',
        );

        expect(søknadKall.at(-1)).toEqual({
            sortering: 'sist_endret,DESC',
            filters: standardSøknaderFilter(),
            side: 0,
        });
    });

    test('paginering henter neste side og ny sortering starter på første side igjen', async ({
        page,
        msw,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                const body = (await request.json()) as BenkRequestBody;
                søknadKall.push(body);
                return HttpResponse.json(
                    lagBenkRespons(
                        BenkTab.SØKNADER,
                        lagBenkOversikt(søknadsrader, {
                            totalAntall: 120,
                            totalAntallUfiltrert: 120,
                            side: body.side,
                        }),
                    ),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=SØKNADER');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');
        await expect(
            page.getByText(
                '120 av totalt 120 behandlinger matcher valgte filtre (2 vises på denne siden)',
            ),
        ).toBeVisible();

        await page.getByRole('button', { name: '2', exact: true }).first().click();

        await forventBenkQuery(page, { tab: 'SØKNADER', side: '1' });
        await expect.poll(() => søknadKall.at(-1)?.side).toBe(1);
        await expect(page.getByRole('button', { name: '2', exact: true }).first()).toHaveAttribute(
            'aria-current',
            'true',
        );

        await page.getByRole('button', { name: 'Kravtidspunkt' }).click();

        await forventBenkQuery(page, { tab: 'SØKNADER', sortering: 'kravtidspunkt,DESC' });
        await expect
            .poll(() => søknadKall.at(-1))
            .toEqual({
                sortering: 'kravtidspunkt,DESC',
                filters: standardSøknaderFilter(),
                side: 0,
            });
    });

    test('lagrede valg i cookien gjenopprettes med redirect når URL-en er uten filtre', async ({
        page,
        msw,
        baseURL,
    }) => {
        const revurderingKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/revurderinger', async ({ request }) => {
                revurderingKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.REVURDERINGER, lagBenkOversikt([lagBenkRevurdering()])),
                );
            }),
            ...fellesHandlere(),
        );

        await settBenkCookie(
            page,
            {
                tab: BenkTab.REVURDERINGER,
                kunTildeltMeg: false,
                skjulPåVent: true,
                skjulEgneTilBeslutning: false,
                filter: { status: BenkBehandlingsstatus.KLAR_TIL_BESLUTNING },
            },
            baseURL!,
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await forventBenkQuery(page, {
            tab: 'REVURDERINGER',
            skjulPåVent: 'true',
            status: 'KLAR_TIL_BESLUTNING',
        });
        await expect(
            page.getByRole('button', { name: 'Skjul behandlinger satt på vent' }),
        ).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByLabel('Status')).toHaveValue('KLAR_TIL_BESLUTNING');

        expect(revurderingKall).toEqual([
            {
                sortering: 'startet,ASC',
                filters: {
                    ...standardRevurderingerFilter,
                    skjulPåVent: true,
                    status: BenkBehandlingsstatus.KLAR_TIL_BESLUTNING,
                },
                side: 0,
            },
        ]);
    });

    test('med fane i URL-en gjenopprettes bare de globale valgene fra en annen fane', async ({
        page,
        msw,
        baseURL,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader)),
                );
            }),
            ...fellesHandlere(),
        );

        await settBenkCookie(
            page,
            {
                tab: BenkTab.REVURDERINGER,
                kunTildeltMeg: false,
                skjulPåVent: true,
                skjulEgneTilBeslutning: false,
                filter: { status: BenkBehandlingsstatus.KLAR_TIL_BESLUTNING },
            },
            baseURL!,
        );

        await page.goto('/?tab=SØKNADER');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await forventBenkQuery(page, { tab: 'SØKNADER', skjulPåVent: 'true' });
        expect(søknadKall).toEqual([
            {
                sortering: 'kravtidspunkt,ASC',
                filters: standardSøknaderFilter({ skjulPåVent: true }),
                side: 0,
            },
        ]);
    });

    test('«Nullstill filtre» fjerner de lokale filtrene, men beholder de globale', async ({
        page,
        msw,
    }) => {
        const søknadKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                søknadKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt(søknadsrader)),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=SØKNADER&status=UNDER_BEHANDLING&skjulPåVent=true');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');
        await expect(page.getByLabel('Status')).toHaveValue('UNDER_BEHANDLING');

        await page.getByRole('button', { name: 'Nullstill filtre' }).click();

        await forventBenkQuery(page, { tab: 'SØKNADER', skjulPåVent: 'true' });
        await expect(page.getByLabel('Status')).toHaveValue('');
        await expect
            .poll(() => søknadKall.at(-1))
            .toEqual({
                sortering: 'kravtidspunkt,ASC',
                filters: standardSøknaderFilter({ skjulPåVent: true }),
                side: 0,
            });
    });

    test('viser feilen fra backend når filtreringen ikke lot seg tolke', async ({ page, msw }) => {
        msw.use(
            http.post('*/benk/soknader', () =>
                HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt([]), {
                        error: 'Ugyldig verdi for status',
                    }),
                ),
            ),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await expect(page.getByText('Feil i filtreringen')).toBeVisible();
        await expect(page.getByText('Ugyldig verdi for status')).toBeVisible();
    });
});
