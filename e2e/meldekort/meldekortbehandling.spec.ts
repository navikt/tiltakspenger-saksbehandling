import {
    expect,
    fellesHandlere,
    forventOverskrift,
    SIDELAST_TIMEOUT,
    test,
} from '../felles/e2eFelles';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import type { OppdaterMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    BRUKERS_SYKEDAG_INDEX,
    DAGSATS,
    DATOER,
    KJEDE_ID,
    PERSONOVERSIKT_URL,
    behandlingUrl,
    beløpRad,
    beløpRegex,
    dagStatus,
    fullUtfylling,
    gåTilSteg,
    lagBrukersMeldekort,
    lagMeldekortBackend,
    lagMeldekortbehandling,
} from './meldekortTestUtils';
import { tilDato } from '~/types/DatoTid';

const forventetLagring = (
    dager: OppdaterMeldekortbehandlingDTO['meldeperioder'][number]['dager'],
    begrunnelse: string | null = null,
): OppdaterMeldekortbehandlingDTO => ({
    meldeperioder: [{ kjedeId: KJEDE_ID, dager }],
    skalSendeVedtaksbrev: false,
    skalJournalføreNotat: false,
    begrunnelse,
    tekstTilVedtaksbrev: null,
    prioritering: null,
});

test.describe('Meldekortbehandling - saksbehandler', () => {
    test('kan starte behandling fra personoversikten, fylle ut fra brukers meldekort, lagre og sende til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagMeldekortBackend({ brukersMeldekort: [lagBrukersMeldekort()] });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(PERSONOVERSIKT_URL);
        await forventOverskrift(page, 'Personoversikt');

        const kjedeRad = page.getByRole('row').filter({ hasText: '06.01.2025 - 19.01.2025' });
        await expect(kjedeRad).toContainText('Mottatt, ikke behandlet (1)');
        await kjedeRad.getByRole('button', { name: 'Se oversikt' }).click();

        await forventOverskrift(page, 'Meldeperiode');
        await page.getByRole('button', { name: 'Start behandling' }).click();

        const startDialog = page.getByRole('dialog');
        await expect(startDialog).toContainText('Start behandling av meldekortet');
        await startDialog.getByRole('button', { name: 'Start behandling' }).click();

        await expect(page).toHaveURL(/\/meldekortbehandling\/meldekort_ny_1/, {
            timeout: SIDELAST_TIMEOUT,
        });
        await forventOverskrift(page, 'Meldekortbehandling');
        expect(backend.requester.opprett).toEqual([{ kjedeIder: [KJEDE_ID] }]);

        await expect(
            page.getByText('Lagre behandlingen for å vise beregning av meldeperioden'),
        ).toBeVisible();

        // Forhåndsutfyll fra brukers meldekort, og overstyr én dag manuelt
        await expect(page.getByRole('heading', { name: 'Meldekort fra bruker' })).toBeVisible();
        await page.getByRole('button', { name: 'Fyll inn disse dagene' }).click();

        await expect(dagStatus(page, tilDato('2025-01-06'))).toHaveValue(
            MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        );
        await expect(dagStatus(page, DATOER[BRUKERS_SYKEDAG_INDEX])).toHaveValue(
            MeldekortbehandlingDagStatus.FraværSyk,
        );
        // Ubesvarte helgedager hos bruker blir "ikke tiltaksdag"
        await expect(dagStatus(page, tilDato('2025-01-11'))).toHaveValue(
            MeldekortbehandlingDagStatus.IkkeTiltaksdag,
        );

        await dagStatus(page, tilDato('2025-01-15')).selectOption({ label: 'Annet fravær' });

        await expect(page.getByText(/Det finnes ulagrede endringer/)).toBeVisible();
        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();
        await expect(page.getByText(/^Sist lagret:/)).toBeVisible();

        const forventedeDager = fullUtfylling().map((dag, index) =>
            index === BRUKERS_SYKEDAG_INDEX
                ? { ...dag, status: MeldekortbehandlingDagStatus.FraværSyk }
                : dag.dato === '2025-01-15'
                  ? { ...dag, status: MeldekortbehandlingDagStatus.FraværAnnet }
                  : dag,
        );
        expect(backend.requester.oppdater).toEqual([forventetLagring(forventedeDager)]);

        // 8 dager deltatt og 1 dag syk gir utbetaling, annet fravær gir det ikke
        const forventetTotalt = 9 * DAGSATS;
        await expect(
            page.getByRole('heading', { name: 'Beregnede beløp for meldeperioden' }),
        ).toBeVisible();
        await expect(beløpRad(page, 'Totalt beløp')).toContainText(beløpRegex(forventetTotalt));

        await gåTilSteg(page, /Beregning og simulering/);
        await expect(beløpRad(page, 'Nytt totalt beløp')).toContainText(
            beløpRegex(forventetTotalt),
        );
        await expect(page.getByText('Simulering mangler!')).toBeVisible();
        await page.getByRole('button', { name: 'Oppdater simulering' }).click();
        await expect(page.getByText('Simulering viser ingen endring i utbetalingen')).toBeVisible();
        expect(backend.requester.oppdaterSimulering).toEqual(['meldekort_ny_1']);

        await gåTilSteg(page, /Begrunnelse, brev og innsending/);
        const sendTilBeslutning = page.getByRole('button', { name: 'Send til beslutning' });
        await expect(sendTilBeslutning).toBeEnabled();

        // Endret begrunnelse må lagres før behandlingen kan sendes
        await page.getByLabel('Begrunnelse (valgfri)').fill('Bruker var syk fredag i uke 2');
        await expect(
            page.getByText('Endringer må lagres før behandlingen kan sendes til beslutning'),
        ).toBeVisible();
        await expect(sendTilBeslutning).toBeDisabled();

        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();
        await expect(sendTilBeslutning).toBeEnabled();
        expect(backend.requester.oppdater.at(-1)).toEqual(
            forventetLagring(forventedeDager, 'Bruker var syk fredag i uke 2'),
        );

        await sendTilBeslutning.click();
        const sendDialog = page.getByRole('dialog');
        await expect(sendDialog).toContainText('Send meldekortbehandlingen til beslutning?');
        await sendDialog.getByRole('button', { name: 'Send til beslutning' }).click();

        await forventOverskrift(page, 'Personoversikt');
        await expect(page.getByText('Meldekortet er sendt til beslutter!')).toBeVisible();
        expect(backend.requester.sendTilBeslutning).toEqual(['meldekort_ny_1']);
        await expect(
            page.getByRole('row').filter({ hasText: '06.01.2025 - 19.01.2025' }),
        ).toContainText('Klar til beslutning (1)');
    });

    test('kan fylle ut dagene med hurtigutfylling, med både knapper og hurtigtaster', async ({
        page,
        msw,
    }) => {
        const behandling = lagMeldekortbehandling();
        const backend = lagMeldekortBackend({ behandlinger: [behandling] });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl(behandling.id));
        await forventOverskrift(page, 'Meldekortbehandling');

        const startHurtigutfylling = page.getByRole('button', { name: 'Start hurtigutfylling' });
        await startHurtigutfylling.click();
        await expect(startHurtigutfylling).toBeDisabled();

        // Uke 2 med knappene i statusvelgeren
        for (let i = 0; i < 4; i++) {
            await page.getByTitle('Deltatt (D)').click();
        }
        await page.getByTitle('Syk (S)').click();

        // Helgen fylles ut automatisk, og utfyllingen fortsetter på mandag i uke 3
        await expect(dagStatus(page, tilDato('2025-01-11'))).toHaveValue(
            MeldekortbehandlingDagStatus.IkkeTiltaksdag,
        );
        await expect(dagStatus(page, tilDato('2025-01-12'))).toHaveValue(
            MeldekortbehandlingDagStatus.IkkeTiltaksdag,
        );
        await expect(dagStatus(page, tilDato('2025-01-13'))).toBeFocused();

        // Uke 3 med hurtigtaster
        for (const tast of ['d', 'd', 'd', 'b', 'd']) {
            await page.keyboard.press(tast);
        }

        // Utfyllingen avsluttes etter siste dag
        await expect(page.getByTitle('Deltatt (D)')).toHaveCount(0);
        await expect(startHurtigutfylling).toBeEnabled();

        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();
        await expect(page.getByText(/^Sist lagret:/)).toBeVisible();

        const forventedeDager = fullUtfylling().map((dag) =>
            dag.dato === '2025-01-10'
                ? { ...dag, status: MeldekortbehandlingDagStatus.FraværSyk }
                : dag.dato === '2025-01-16'
                  ? { ...dag, status: MeldekortbehandlingDagStatus.FraværSyktBarn }
                  : dag,
        );
        expect(backend.requester.oppdater).toEqual([forventetLagring(forventedeDager)]);
        await expect(beløpRad(page, 'Totalt beløp')).toContainText(beløpRegex(10 * DAGSATS));
    });
});
