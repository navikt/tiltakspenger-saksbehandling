import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    test,
} from '../felles/e2eFelles';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    behandlingUrl,
    dagStatus,
    fullUtfylling,
    gåTilSteg,
    lagMeldekortBackend,
    lagMeldekortbehandling,
} from './meldekortTestUtils';

const FOR_MANGE_DAGER_FEIL =
    'For mange dager med deltatt eller fravær. 11 dager utfylt, 10 er maks for meldeperioden.';

test.describe('Meldekortbehandling - validering', () => {
    test('ubesvarte dager vises som feil, og behandlingen kan ikke sendes til beslutning', async ({
        page,
        msw,
    }) => {
        const behandling = lagMeldekortbehandling();
        const backend = lagMeldekortBackend({ behandlinger: [behandling] });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl(behandling.id));
        await forventOverskrift(page, 'Meldekortbehandling');

        await dagStatus(page, '2025-01-06').selectOption({ label: 'Deltatt' });
        await dagStatus(page, '2025-01-13').selectOption({ label: 'Deltatt' });

        // Sammenhengende ubesvarte dager grupperes i feilmeldingen
        const synligTekst = (tekst: string) => page.getByText(tekst).filter({ visible: true });
        await expect(synligTekst('Feil eller mangler i behandlingen')).toBeVisible();
        await expect(synligTekst('Meldeperiode 06.01 - 19.01.2025')).toBeVisible();
        await expect(synligTekst('07.01 - 12.01.2025: Status må besvares')).toBeVisible();
        await expect(synligTekst('14.01 - 19.01.2025: Status må besvares')).toBeVisible();
        await expect(page.getByText(/06\.01\.2025: Status må besvares/)).toHaveCount(0);

        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();
        await expect(page.getByText(/^Sist lagret:/)).toBeVisible();

        await gåTilSteg(page, /Begrunnelse, brev og innsending/);
        await expect(
            page.getByText('Må rettes før behandlingen kan sendes til beslutning.'),
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send til beslutning' })).toBeDisabled();
        expect(backend.requester.sendTilBeslutning).toEqual([]);
    });

    test('for mange dager med deltakelse gir feilmelding som forsvinner når dagen rettes', async ({
        page,
        msw,
    }) => {
        const behandling = lagMeldekortbehandling({ dager: fullUtfylling() });
        const backend = lagMeldekortBackend({ behandlinger: [behandling] });
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl(behandling.id));
        await forventOverskrift(page, 'Meldekortbehandling');
        await expect(page.getByText(FOR_MANGE_DAGER_FEIL)).toHaveCount(0);

        // 10 hverdager er allerede utfylt, og en lørdag gir én dag for mye
        await dagStatus(page, '2025-01-11').selectOption({ label: 'Deltatt' });
        await expect(page.getByText(FOR_MANGE_DAGER_FEIL).filter({ visible: true })).toBeVisible();

        await gåTilSteg(page, /Begrunnelse, brev og innsending/);
        await expect(
            page.getByText('Må rettes før behandlingen kan sendes til beslutning.'),
        ).toBeVisible();
        const sendTilBeslutning = page.getByRole('button', { name: 'Send til beslutning' });
        await expect(sendTilBeslutning).toBeDisabled();

        // Tilbakestilles dagen, er skjemaet likt det lagrede og gyldig igjen
        await gåTilSteg(page, /Meldeperioder/);
        await dagStatus(page, '2025-01-11').selectOption({ label: 'Ikke tiltaksdag' });
        await expect(page.getByText(FOR_MANGE_DAGER_FEIL)).toHaveCount(0);

        await gåTilSteg(page, /Begrunnelse, brev og innsending/);
        await expect(sendTilBeslutning).toBeEnabled();
        expect(backend.requester.oppdater).toEqual([]);
    });

    test('viser feilmelding fra backend når lagringen avvises', async ({ page, msw }) => {
        const behandling = lagMeldekortbehandling({ dager: fullUtfylling() });
        const backend = lagMeldekortBackend({ behandlinger: [behandling] });
        const avvisteLagringer: unknown[] = [];
        msw.use(
            http.post('*/sak/:sakId/meldekort/:id/oppdater', async ({ request }) => {
                avvisteLagringer.push(await request.json());
                return HttpResponse.json(
                    {
                        kode: 'for_mange_dager_utfylt',
                        melding: 'For mange dager utfylt',
                    },
                    { status: 400 },
                );
            }),
            ...fellesHandlere(),
            ...backend.handlere,
        );

        await page.goto(behandlingUrl(behandling.id));
        await forventOverskrift(page, 'Meldekortbehandling');

        await dagStatus(page, '2025-01-11').selectOption({ label: 'Deltatt' });
        await page.getByRole('button', { name: 'Lagre og oppdater beregning' }).click();

        await expect(
            page.getByText(
                'Feil ved lagring: Det er fylt ut flere dager enn tillatt på dette meldekortet (kode 400)',
            ),
        ).toBeVisible();
        await expect(page.getByText(/Det finnes ulagrede endringer/)).toBeVisible();
        expect(avvisteLagringer).toHaveLength(1);
        expect(backend.hentBehandling(behandling.id).meldeperioder[0]?.dager).toEqual(
            fullUtfylling(),
        );
        expect(
            (avvisteLagringer[0] as { meldeperioder: { dager: unknown[] }[] }).meldeperioder[0]
                ?.dager[5],
        ).toEqual({
            dato: '2025-01-11',
            status: MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        });
    });
});
