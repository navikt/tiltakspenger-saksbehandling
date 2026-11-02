import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import type { BenkMineRequestBody } from '~/lib/benk/typer/mine';
import { BenkTab } from '~/lib/benk/typer/tabs';
import { ÅpenBehandlingType } from '~/lib/personoversikt/typer/ÅpenBehandling';
import type { SakProps } from '~/lib/sak/SakTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { sak, søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
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
    lagBenkMineRespons,
    lagBenkOversikt,
    lagBenkRespons,
    lagBenkSøknadsbehandling,
} from './benkTestUtils';

type TaBehandlingerRequest = {
    behandlinger: Array<{ behandlingId: string; sakId: string }>;
    returnerSaker: boolean;
};

const tildelbarRad = lagBenkSøknadsbehandling({
    gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
});

const andreTildelbareRad = lagBenkSøknadsbehandling({
    id: 'beh_benk_2',
    sakId: ikkeSladdet('sak_benk_2'),
    fnr: ikkeSladdet('22222222222'),
    saksnummer: ikkeSladdet(tilSaksnummer('202501011002')),
    gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
});

/** Saken behandlingssiden henter etter tildelingen, med behandlingen tildelt den innloggede */
const sakMedTildeltBehandling = (): SakProps => {
    const behandling = søknadsbehandlingIkkeValgt({
        id: 'beh_benk_1',
        sakId: 'sak_benk_1',
        saksbehandler: SAKSBEHANDLER_IDENT,
    });

    return sak({
        sakId: 'sak_benk_1',
        rammebehandlinger: [behandling],
        åpneBehandlinger: [{ id: behandling.id, type: ÅpenBehandlingType.SØKNADSBEHANDLING }],
    });
};

test.describe('Benken - tildeling', () => {
    test('«Tildel meg» i menyen tildeler behandlingen og navigerer til den', async ({
        page,
        msw,
    }) => {
        const taKall: TaBehandlingerRequest[] = [];
        const hentetSaksnummer: string[] = [];

        msw.use(
            http.post('*/benk/soknader', () =>
                HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt([tildelbarRad])),
                ),
            ),
            http.post('*/behandlinger/ta', async ({ request }) => {
                taKall.push((await request.json()) as TaBehandlingerRequest);
                return HttpResponse.json({
                    behandlinger: [{ behandlingId: 'beh_benk_1', saksnummer: '202501011001' }],
                    saker: [sakMedTildeltBehandling()],
                });
            }),
            http.get('*/sak/:saksnummer', ({ params }) => {
                hentetSaksnummer.push(params.saksnummer as string);
                return HttpResponse.json(sakMedTildeltBehandling());
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        // Uten Saksbehandle-kommandoen kan behandlingen bare åpnes, ikke fortsettes
        await expect(page.getByRole('button', { name: 'Åpne' })).toBeVisible();

        await page.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Tildel meg' }).click();

        await expect(page).toHaveURL(/\/sak\/202501011001\/behandling\/beh_benk_1$/, {
            timeout: 30_000,
        });
        expect(taKall).toEqual([
            {
                behandlinger: [{ behandlingId: 'beh_benk_1', sakId: 'sak_benk_1' }],
                returnerSaker: true,
            },
        ]);
        expect(hentetSaksnummer).toContain('202501011001');
    });

    test('feil ved «Tildel meg» vises i dialogen og kan prøves på nytt', async ({ page, msw }) => {
        let antallKall = 0;

        msw.use(
            http.post('*/benk/soknader', () =>
                HttpResponse.json(
                    lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt([tildelbarRad])),
                ),
            ),
            http.post('*/behandlinger/ta', () => {
                antallKall++;
                return HttpResponse.json(
                    { melding: 'Behandlingen er allerede tildelt', kode: 'allerede_tildelt' },
                    { status: 409 },
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Tildel meg' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Kunne ikke tildele deg behandlingen')).toBeVisible();
        await expect(dialog.getByText(/\(kode 409\)/)).toBeVisible();

        await dialog.getByRole('button', { name: 'Prøv igjen' }).click();
        await expect.poll(() => antallKall).toBe(2);

        await dialog.getByRole('button', { name: 'Avbryt' }).click();
        await expect(dialog).toBeHidden();
        await expect(page).toHaveURL(/\/$/);
    });

    test('«Tildel flere» tildeler de valgte behandlingene og viser mine behandlinger', async ({
        page,
        msw,
    }) => {
        const taKall: TaBehandlingerRequest[] = [];
        const mineKall: BenkMineRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', () =>
                HttpResponse.json(
                    lagBenkRespons(
                        BenkTab.SØKNADER,
                        lagBenkOversikt([tildelbarRad, andreTildelbareRad]),
                    ),
                ),
            ),
            http.post('*/behandlinger/ta', async ({ request }) => {
                taKall.push((await request.json()) as TaBehandlingerRequest);
                return HttpResponse.json({
                    behandlinger: [
                        { behandlingId: 'beh_benk_1', saksnummer: '202501011001' },
                        { behandlingId: 'beh_benk_2', saksnummer: '202501011002' },
                    ],
                    saker: [],
                });
            }),
            http.post('*/benk/mine', async ({ request }) => {
                mineKall.push((await request.json()) as BenkMineRequestBody);
                return HttpResponse.json(
                    lagBenkMineRespons({
                        [BenkTab.SØKNADER]: lagBenkOversikt([
                            { ...tildelbarRad, saksbehandler: SAKSBEHANDLER_IDENT },
                            { ...andreTildelbareRad, saksbehandler: SAKSBEHANDLER_IDENT },
                        ]),
                    }),
                );
            }),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('button', { name: 'Tildel flere' }).click();
        await expect(page.getByRole('menuitem', { name: 'Ta som beslutter' })).toHaveCount(0);
        await page.getByRole('menuitem', { name: 'Ta som saksbehandler' }).click();

        const tildelKnapp = page.getByRole('button', { name: 'Tildel', exact: true });
        await expect(tildelKnapp).toBeDisabled();

        const avkrysninger = page.getByRole('checkbox', { name: 'Tildel' });
        await expect(avkrysninger).toHaveCount(2);
        await avkrysninger.nth(0).check();
        await avkrysninger.nth(1).check();

        await tildelKnapp.click();

        const dialog = page.getByRole('dialog', { name: 'Tildel meg 2 behandlinger' });
        await expect(dialog).toBeVisible();
        await expect(
            dialog.getByRole('link', { name: '/sak/202501011001/behandling/beh_benk_1' }),
        ).toBeVisible();
        await expect(
            dialog.getByRole('link', { name: '/sak/202501011002/behandling/beh_benk_2' }),
        ).toBeVisible();

        await dialog.getByRole('button', { name: 'Tildel', exact: true }).click();

        await forventBenkQuery(page, { tab: 'MINE' });
        await expect(page.getByRole('heading', { name: 'Søknader (2)' })).toBeVisible();

        expect(taKall).toEqual([
            {
                behandlinger: [
                    { behandlingId: 'beh_benk_1', sakId: 'sak_benk_1' },
                    { behandlingId: 'beh_benk_2', sakId: 'sak_benk_2' },
                ],
                returnerSaker: false,
            },
        ]);
        expect(mineKall).toHaveLength(1);
    });
});
