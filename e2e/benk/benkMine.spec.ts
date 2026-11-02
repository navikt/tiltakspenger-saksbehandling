import type { BenkMineRequestBody } from '~/lib/benk/typer/mine';
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
    lagBenkMineRespons,
    lagBenkOversikt,
    lagBenkRevurdering,
    lagBenkSøknadsbehandling,
} from './benkTestUtils';

const standardMineSortering = {
    [BenkTab.SØKNADER]: 'kravtidspunkt,ASC',
    [BenkTab.REVURDERINGER]: 'startet,ASC',
    [BenkTab.MELDEKORT]: 'periode,ASC',
    [BenkTab.KLAGE]: 'kravtidspunkt,ASC',
    [BenkTab.TILBAKEKREVING]: 'startet,ASC',
};

const standardMineFilter = {
    seksjon: null,
    beskyttelse: null,
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
};

const minSøknad = lagBenkSøknadsbehandling({ saksbehandler: SAKSBEHANDLER_IDENT });
const minRevurdering = lagBenkRevurdering({ saksbehandler: SAKSBEHANDLER_IDENT });

test.describe('Benken - mine behandlinger', () => {
    test('viser én seksjon per fane med behandlinger tildelt meg', async ({ page, msw }) => {
        const mineKall: BenkMineRequestBody[] = [];

        msw.use(
            http.post('*/benk/mine', async ({ request }) => {
                mineKall.push((await request.json()) as BenkMineRequestBody);
                return HttpResponse.json(
                    lagBenkMineRespons(
                        {
                            [BenkTab.SØKNADER]: lagBenkOversikt([minSøknad]),
                            [BenkTab.REVURDERINGER]: lagBenkOversikt([minRevurdering]),
                            [BenkTab.KLAGE]: lagBenkOversikt([]),
                        },
                        { antallPerTab: lagAntallPerTab({ MINE: 3, [BenkTab.SØKNADER]: 10 }) },
                    ),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=MINE');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await expect(page.getByRole('tab', { name: 'Mine behandlinger (3)' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        await expect(
            page.getByText('2 av totalt 3 behandlinger tildelt deg matcher valgte filtre'),
        ).toBeVisible();

        const søknader = page.getByRole('region', { name: 'Søknader' });
        await expect(søknader.getByRole('heading', { name: 'Søknader (1)' })).toBeVisible();
        await expect(søknader.getByRole('link', { name: '12345678911' })).toBeVisible();

        const revurderinger = page.getByRole('region', { name: 'Revurderinger' });
        await expect(
            revurderinger.getByRole('heading', { name: 'Revurderinger (1)' }),
        ).toBeVisible();
        await expect(revurderinger.getByRole('link', { name: '22222222222' })).toBeVisible();

        // Seksjoner uten behandlinger vises ikke
        await expect(page.getByRole('region', { name: 'Klage' })).toHaveCount(0);

        // Mine-fanen viser bare egne behandlinger, så disse valgene gir ingen mening der
        await expect(page.getByRole('button', { name: 'Vis kun saker tildelt meg' })).toHaveCount(
            0,
        );
        await expect(page.getByRole('button', { name: 'Tildel flere' })).toHaveCount(0);

        expect(mineKall).toEqual([
            { sortering: standardMineSortering, filters: standardMineFilter },
        ]);
    });

    test('filter på behandlingstype og sortering per seksjon sendes til backend', async ({
        page,
        msw,
    }) => {
        const mineKall: BenkMineRequestBody[] = [];

        msw.use(
            http.post('*/benk/mine', async ({ request }) => {
                const body = (await request.json()) as BenkMineRequestBody;
                mineKall.push(body);
                const seksjoner =
                    body.filters.seksjon === BenkTab.REVURDERINGER
                        ? { [BenkTab.REVURDERINGER]: lagBenkOversikt([minRevurdering]) }
                        : {
                              [BenkTab.SØKNADER]: lagBenkOversikt([minSøknad]),
                              [BenkTab.REVURDERINGER]: lagBenkOversikt([minRevurdering]),
                          };
                return HttpResponse.json(
                    lagBenkMineRespons(seksjoner, { antallPerTab: lagAntallPerTab({ MINE: 2 }) }),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=MINE');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByLabel('Behandlingstype').selectOption({ label: 'Revurderinger' });
        await page.getByRole('button', { name: 'Oppdater filtre' }).click();

        await forventBenkQuery(page, { tab: 'MINE', seksjon: 'REVURDERINGER' });
        await expect(page.getByRole('region', { name: 'Søknader' })).toHaveCount(0);
        await expect(
            page.getByText('1 av totalt 2 behandlinger tildelt deg matcher valgte filtre'),
        ).toBeVisible();
        expect(mineKall.at(-1)).toEqual({
            sortering: standardMineSortering,
            filters: { ...standardMineFilter, seksjon: BenkTab.REVURDERINGER },
        });

        await page
            .getByRole('region', { name: 'Revurderinger' })
            .getByRole('button', { name: 'Startet' })
            .click();

        await forventBenkQuery(page, {
            tab: 'MINE',
            seksjon: 'REVURDERINGER',
            'sortering-REVURDERINGER': 'startet,DESC',
        });
        await expect
            .poll(() => mineKall.at(-1))
            .toEqual({
                sortering: { ...standardMineSortering, [BenkTab.REVURDERINGER]: 'startet,DESC' },
                filters: { ...standardMineFilter, seksjon: BenkTab.REVURDERINGER },
            });
    });

    test('viser tom-tekst når ingen behandlinger er tildelt meg', async ({ page, msw }) => {
        msw.use(
            http.post('*/benk/mine', () => HttpResponse.json(lagBenkMineRespons({}))),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=MINE');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await expect(page.getByText('Du har ingen åpne behandlinger tildelt deg.')).toBeVisible();
    });

    test('skiller mellom ingen tildelte og ingen som matcher filtrene', async ({ page, msw }) => {
        msw.use(
            http.post('*/benk/mine', () =>
                HttpResponse.json(
                    lagBenkMineRespons({}, { antallPerTab: lagAntallPerTab({ MINE: 4 }) }),
                ),
            ),
            ...fellesHandlere(),
        );

        await page.goto('/?tab=MINE&skjulPåVent=true');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await expect(
            page.getByText('Ingen av behandlingene tildelt deg matcher valgte filtre.'),
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Skjul behandlinger satt på vent' }),
        ).toHaveAttribute('aria-pressed', 'true');
    });
});
