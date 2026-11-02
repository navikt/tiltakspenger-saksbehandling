import {
    BESLUTTER_IDENT,
    expect,
    fellesHandlere,
    forventOverskrift,
    lagBeslutter,
    test,
} from '../felles/e2eFelles';
import {
    MeldekortbehandlingStatus,
    MeldekortbehandlingId,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import {
    behandlingUrl,
    beløpRad,
    beløpRegex,
    DAGSATS,
    fullUtfylling,
    gåTilSteg,
    lagMeldekortBackend,
    lagMeldekortbehandling,
    PERSONOVERSIKT_URL,
    velgIMeny,
} from './meldekortTestUtils';

const BEHANDLING_ID = 'meldekort_behandling_1' as MeldekortbehandlingId;

const lagBeslutterBackend = () => {
    const innlogget = lagBeslutter();
    const backend = lagMeldekortBackend({
        innlogget,
        behandlinger: [
            lagMeldekortbehandling({
                id: BEHANDLING_ID,
                dager: fullUtfylling(),
                status: MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING,
                begrunnelse: { verdi: 'Alle dager er kontrollert', erSladdet: false },
            }),
        ],
    });
    return { innlogget, backend };
};

test.describe('Meldekortbehandling - beslutter', () => {
    test('beslutter kan tildele seg behandlingen og godkjenne meldekortet', async ({
        page,
        msw,
    }) => {
        const { innlogget, backend } = lagBeslutterBackend();
        msw.use(...fellesHandlere(innlogget), ...backend.handlere);

        await page.goto(behandlingUrl(BEHANDLING_ID));
        await forventOverskrift(page, 'Meldekortbehandling');
        await expect(page.getByText('Beslutter:').locator('..')).toContainText('Ikke tildelt');
        await expect(page.getByRole('button', { name: 'Godkjenn meldekort' })).toHaveCount(0);

        await velgIMeny(page, 'Tildel meg');
        await expect(page.getByText('Beslutter:').locator('..')).toContainText(BESLUTTER_IDENT);
        expect(backend.requester.ta).toEqual([BEHANDLING_ID]);

        // Beslutter ser beregningen, men kan ikke endre dagene
        await expect(beløpRad(page, 'Totalt beløp')).toContainText(beløpRegex(10 * DAGSATS));
        await expect(page.getByRole('button', { name: 'Lagre og oppdater beregning' })).toHaveCount(
            0,
        );

        await gåTilSteg(page, /Begrunnelse, brev og godkjenning/);
        await page.getByRole('button', { name: 'Godkjenn meldekort' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText('Godkjenn meldekortet?');
        await dialog.getByRole('button', { name: 'Godkjenn meldekort' }).click();

        await forventOverskrift(page, 'Personoversikt');
        await expect(page.getByText('Meldekortet er godkjent')).toBeVisible();
        expect(backend.requester.iverksett).toEqual([BEHANDLING_ID]);

        await expect(
            page.getByRole('row').filter({ hasText: '06.01.2025 - 19.01.2025' }),
        ).toContainText('Godkjent (1)');
        const godkjent = backend.hentBehandling(BEHANDLING_ID);
        expect(godkjent.status).toBe(MeldekortbehandlingStatus.GODKJENT);
        expect(godkjent.attesteringer.map((a) => a.status)).toEqual([Attesteringsstatus.GODKJENT]);
    });

    test('beslutter kan underkjenne meldekortet med begrunnelse', async ({ page, msw }) => {
        const { innlogget, backend } = lagBeslutterBackend();
        msw.use(...fellesHandlere(innlogget), ...backend.handlere);

        await page.goto(behandlingUrl(BEHANDLING_ID));
        await forventOverskrift(page, 'Meldekortbehandling');
        await velgIMeny(page, 'Tildel meg');
        await expect(page.getByText('Beslutter:').locator('..')).toContainText(BESLUTTER_IDENT);

        await gåTilSteg(page, /Begrunnelse, brev og godkjenning/);
        await page.getByRole('button', { name: 'Underkjenn' }).click();

        const dialog = page.getByRole('dialog');
        await dialog.getByRole('button', { name: 'Underkjenn' }).click();
        await expect(dialog.getByText('Begrunnelse er påkrevd')).toBeVisible();
        expect(backend.requester.underkjenn).toEqual([]);

        await dialog.getByLabel('Begrunnelse').fill('  Fredag i uke 3 skal være syk  ');
        await dialog.getByRole('button', { name: 'Underkjenn' }).click();

        await forventOverskrift(page, 'Personoversikt');
        await expect(page.getByText('Meldekortet er underkjent')).toBeVisible();
        expect(backend.requester.underkjenn).toEqual([
            { begrunnelse: 'Fredag i uke 3 skal være syk' },
        ]);
        expect(backend.requester.iverksett).toEqual([]);

        const underkjent = backend.hentBehandling(BEHANDLING_ID);
        expect(underkjent.status).toBe(MeldekortbehandlingStatus.UNDER_BEHANDLING);
        expect(underkjent.attesteringer.at(-1)?.status).toBe(Attesteringsstatus.SENDT_TILBAKE);

        // Behandlingen er tilbake hos saksbehandler, med beslutters begrunnelse synlig
        await page.goto(behandlingUrl(BEHANDLING_ID));
        await forventOverskrift(page, 'Meldekortbehandling');
        await expect(page.getByText('Behandlingen er underkjent av beslutter')).toBeVisible();
        await expect(page.getByText('Fredag i uke 3 skal være syk')).toBeVisible();
    });
});
