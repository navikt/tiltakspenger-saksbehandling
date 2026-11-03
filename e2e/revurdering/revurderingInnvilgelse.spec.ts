import { expect, fellesHandlere, forventOverskrift, test } from '../felles/e2eFelles';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    RevurderingResultat,
    type OppdaterRevurderingInnvilgelseDTO,
    type StartRevurderingDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import { behandlingUrl, lagFalskBackend, personoversiktUrl } from './revurderingTestUtils';
import { tilDato } from '~/types/DatoTid';

test.describe('Revurdering av innvilgelse', () => {
    test('saksbehandler forlenger innvilgelsen, lagrer og sender til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        // 1. Start revurdering av innvilgelse fra «Opprett behandling»-menyen
        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Opprett revurdering' }).click();

        const modal = page.getByRole('dialog', { name: 'Start revurdering' });
        await modal.getByRole('radio', { name: 'Innvilgelse' }).check();
        await modal.getByRole('button', { name: 'Opprett revurdering (Innvilgelse)' }).click();

        await expect(page).toHaveURL(behandlingUrl, { timeout: 30_000 });
        await forventOverskrift(page, 'Revurdering av innvilgelse');
        expect(backend.tilstand.startBodies).toEqual([
            {
                revurderingType: RevurderingResultat.INNVILGELSE,
                rammevedtakIdSomOmgjøres: null,
            } satisfies StartRevurderingDTO,
        ]);

        // Resten av skjemaet vises først når en hel innvilgelsesperiode er valgt
        await expect(page.getByRole('heading', { name: 'Innvilgelsesperioder' })).toBeVisible();
        await expect(page.getByLabel('Antall dager')).toHaveCount(0);

        // 2. Forleng innvilgelsen ut tiltaksdeltakelsen
        await page.getByRole('textbox', { name: 'Fra og med' }).fill('01.04.2025');
        await page.getByRole('textbox', { name: 'Til og med' }).fill('30.06.2025');

        await expect(page.getByLabel('Antall dager')).toHaveValue('10');
        await expect(
            page.getByRole('heading', { name: 'Vedtaksbrev for revurdering av innvilgelse' }),
        ).toBeVisible();
        await expect(page.getByRole('radio', { name: 'Nei' })).toBeChecked();

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering' })
            .fill('Tiltaket er forlenget');
        await page
            .getByRole('textbox', { name: 'Tekst til vedtaksbrev' })
            .fill('Du får tiltakspenger lenger');

        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();

        // 3. Lagre
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect
            .poll(() => backend.tilstand.oppdaterBodies)
            .toEqual([
                {
                    resultat: RevurderingResultat.INNVILGELSE,
                    begrunnelseVilkårsvurdering: 'Tiltaket er forlenget',
                    fritekstTilVedtaksbrev: 'Du får tiltakspenger lenger',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    innvilgelsesperioder: [
                        {
                            periode: {
                                fraOgMed: tilDato('2025-04-01'),
                                tilOgMed: tilDato('2025-06-30'),
                            },
                            antallDagerPerMeldeperiode: 10,
                            internDeltakelseId: 'deltakelse_1',
                        },
                    ],
                    barnetillegg: { begrunnelse: null, perioder: [] },
                    skalSendeVedtaksbrev: true,
                } satisfies OppdaterRevurderingInnvilgelseDTO,
            ]);
        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();

        // Skjemaet lastes på nytt fra den lagrede behandlingen, og periodene beholdes
        await expect(page.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.04.2025');
        await expect(page.getByRole('textbox', { name: 'Til og med' })).toHaveValue('30.06.2025');

        // 4. Send til beslutning
        await page.getByRole('button', { name: 'Send til beslutter' }).click();
        await page.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page).toHaveURL(personoversiktUrl, { timeout: 30_000 });
        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.tilstand.antallSendTilBeslutning).toBe(1);
        expect(backend.tilstand.revurdering?.status).toBe(
            Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
        );
    });
});
