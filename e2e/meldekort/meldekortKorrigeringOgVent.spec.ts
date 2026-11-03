import {
    expect,
    fellesHandlere,
    forventOverskrift,
    SAKSBEHANDLER_IDENT,
    SIDELAST_TIMEOUT,
    test,
} from '../felles/e2eFelles';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingStatus,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import type { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import type { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Attesteringsstatus } from '~/lib/behandling-felles/typer/Attestering';
import { Utbetalingsstatus } from '~/lib/_felles/utbetaling/utbetalingTyper';
import {
    behandlingUrl,
    beløpRad,
    beløpRegex,
    DAGSATS,
    dagStatus,
    fullUtfylling,
    gåTilSteg,
    KJEDE_URL,
    lagMeldekortBackend,
    lagMeldekortbehandling,
    SAK_ID,
    velgIMeny,
} from './meldekortTestUtils';
import { tilDato, tilTidspunkt } from '~/types/DatoTid';

const lagGodkjentBehandling = () => {
    const id = 'meldekort_godkjent_1' as MeldekortbehandlingId;
    const behandling = lagMeldekortbehandling({
        id,
        dager: fullUtfylling(),
        status: MeldekortbehandlingStatus.GODKJENT,
        erAvsluttet: true,
        beslutter: 'Z654321',
        godkjentTidspunkt: tilTidspunkt('2025-01-20T12:00:00'),
        utbetalingsstatus: Utbetalingsstatus.OK,
        attesteringer: [
            {
                status: Attesteringsstatus.GODKJENT,
                begrunnelse: ikkeSladdet(null),
                endretAv: 'Z654321',
                endretTidspunkt: tilTidspunkt('2025-01-20T12:00:00'),
            },
        ],
    });
    const vedtak: Meldekortvedtak = {
        id: 'vedtak_meldekort_1',
        sakId: SAK_ID,
        meldekortId: id,
        opprettet: tilTidspunkt('2025-01-20T12:00:00'),
        journalpostId: null,
    };
    return { behandling, vedtak };
};

test.describe('Meldekortbehandling - korrigering og sett på vent', () => {
    test('kan korrigere et godkjent meldekort, og ser endringen i beregningen', async ({
        page,
        msw,
    }) => {
        const { behandling: godkjent, vedtak } = lagGodkjentBehandling();
        const backend = lagMeldekortBackend({
            behandlinger: [godkjent],
            meldekortvedtak: [vedtak],
        });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(KJEDE_URL);
        await forventOverskrift(page, 'Meldeperiode');
        await expect(page.getByRole('button', { name: 'Start behandling' })).toHaveCount(0);
        await page.getByRole('button', { name: 'Start korrigering' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText('Start korrigering av meldekortet');
        await dialog.getByRole('button', { name: 'Start korrigering' }).click();

        await forventOverskrift(page, 'Meldekortbehandling');
        await expect(page).toHaveURL(/\/meldekortbehandling\/meldekort_ny_2/, {
            timeout: SIDELAST_TIMEOUT,
        });
        await expect(page.getByRole('heading', { name: 'Korrigering' })).toBeVisible();

        // Korrigeringen starter med dagene fra det godkjente meldekortet
        await expect(dagStatus(page, tilDato('2025-01-17'))).toHaveValue(
            MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        );
        await dagStatus(page, tilDato('2025-01-17')).selectOption({ label: 'Annet fravær' });
        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();
        await expect(page.getByText(/^Sist lagret:/)).toBeVisible();

        const forventedeDager = fullUtfylling().map((dag) =>
            dag.dato === '2025-01-17'
                ? { ...dag, status: MeldekortbehandlingDagStatus.FraværAnnet }
                : dag,
        );
        expect(backend.requester.oppdater.map((body) => body.meldeperioder[0]?.dager)).toEqual([
            forventedeDager,
        ]);

        // Nytt beløp med differansen mot forrige utbetaling
        const totaltRad = beløpRad(page, 'Totalt beløp');
        await expect(totaltRad).toContainText(beløpRegex(9 * DAGSATS));
        await expect(totaltRad).toContainText(new RegExp(`\\(\\s*[-−]\\s*${DAGSATS}`));

        await gåTilSteg(page, /Beregning og simulering/);
        await expect(beløpRad(page, 'Nytt totalt beløp')).toContainText(
            new RegExp(`\\(\\s*[-−]\\s*${DAGSATS}`),
        );

        await gåTilSteg(page, /Begrunnelse, brev og innsending/);
        await expect(page.getByText('Korrigert utbetaling')).toBeVisible();
        await expect(
            page.getByText(/^Vurder å sende forhåndsvarsling til bruker om mulig tilbakebetaling/),
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send til beslutning' })).toBeEnabled();

        const korrigering = backend.hentBehandling('meldekort_ny_2' as MeldekortbehandlingId);
        expect(korrigering.meldeperioder[0]?.type).toBe(MeldeperiodebehandlingType.KORRIGERING);
    });

    test('kan sette behandlingen på vent og gjenoppta den fra personoversikten', async ({
        page,
        msw,
    }) => {
        const behandling = lagMeldekortbehandling({ dager: fullUtfylling() });
        const backend = lagMeldekortBackend({ behandlinger: [behandling] });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl(behandling.id));
        await forventOverskrift(page, 'Meldekortbehandling');

        await velgIMeny(page, 'Sett på vent');
        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText('Sett meldekortbehandlingen på vent?');

        await dialog.getByRole('button', { name: 'Sett behandling på vent' }).click();
        await expect(dialog.getByText('Du må fylle ut en begrunnelse')).toBeVisible();
        expect(backend.requester.vent).toEqual([]);

        await dialog
            .getByLabel('Hvorfor settes behandlingen på vent? (obligatorisk)')
            .fill('Venter på svar fra tiltaksarrangør');
        await dialog.getByRole('button', { name: 'Sett behandling på vent' }).click();

        await forventOverskrift(page, 'Personoversikt');
        await expect(page.getByText('Meldekortbehandlingen er satt på vent')).toBeVisible();
        expect(backend.requester.vent).toEqual([
            {
                begrunnelse: 'Venter på svar fra tiltaksarrangør',
                frist: null,
                oppdaterSattPåVent: false,
            },
        ]);

        const behandlingRad = page
            .getByRole('row')
            .filter({ has: page.getByRole('button', { name: 'Meny' }) });
        await expect(behandlingRad).toContainText('Klar til behandling');

        await behandlingRad.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Gjenoppta' }).click();

        await forventOverskrift(page, 'Meldekortbehandling');
        expect(backend.requester.gjenoppta).toEqual([behandling.id]);
        await expect(page.getByText('Saksbehandler:').locator('..')).toContainText(
            SAKSBEHANDLER_IDENT,
        );
        await expect(
            page.getByRole('button', { name: 'Lagre og oppdater beregning' }),
        ).toBeVisible();
        await expect(page.getByText('Behandlingen er satt på vent')).toHaveCount(0);
        expect(backend.hentBehandling(behandling.id).status).toBe(
            MeldekortbehandlingStatus.UNDER_BEHANDLING,
        );
    });
});
