import { expect, fellesHandlere, forventOverskrift, test } from '../felles/e2eFelles';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    HjemmelForStans,
    RevurderingResultat,
    type OppdaterRevurderingStansDTO,
    type StartRevurderingDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import { behandlingUrl, lagFalskBackend, personoversiktUrl } from './revurderingTestUtils';
import { tilDato } from '~/types/DatoTid';

test.describe('Revurdering til stans', () => {
    test('saksbehandler starter stans fra personoversikten, lagrer og sender til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        // 1. Start revurdering til stans fra «Opprett behandling»-menyen
        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Opprett revurdering' }).click();

        const modal = page.getByRole('dialog', { name: 'Start revurdering' });
        const opprettKnapp = modal.getByRole('button', { name: /^Opprett revurdering/ });
        await expect(opprettKnapp).toBeDisabled();

        await modal.getByRole('radio', { name: 'Stans' }).check();
        await expect(opprettKnapp).toHaveText('Opprett revurdering (Stans)');
        await opprettKnapp.click();

        await expect(page).toHaveURL(behandlingUrl, { timeout: 30_000 });
        await forventOverskrift(page, 'Revurdering til stans av tiltakspenger');
        expect(backend.tilstand.startBodies).toEqual([
            {
                revurderingType: RevurderingResultat.STANS,
                rammevedtakIdSomOmgjøres: null,
            } satisfies StartRevurderingDTO,
        ]);

        // 2. Fyll ut hjemmel, stansdato, begrunnelse og brev
        await page
            .getByLabel('Hjemmel for stans')
            .selectOption({ label: 'Ingen deltakelse - tiltakspengeforskriften § 2' });
        await page.getByRole('textbox', { name: 'Stans fra og med' }).fill('01.03.2025');
        await page
            .getByRole('textbox', { name: 'Begrunnelse for stans' })
            .fill('Sluttet på tiltak');
        await page.getByRole('textbox', { name: 'Tekst til vedtaksbrev' }).fill('Du har sluttet');

        await expect(
            page.getByText('Endringer må lagres før behandlingen kan sendes til beslutter'),
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();

        // 3. Lagre
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await expect
            .poll(() => backend.tilstand.oppdaterBodies)
            .toEqual([
                {
                    resultat: RevurderingResultat.STANS,
                    begrunnelseVilkårsvurdering: 'Sluttet på tiltak',
                    fritekstTilVedtaksbrev: 'Du har sluttet',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    valgteHjemler: [HjemmelForStans.DeltarIkkePåArbeidsmarkedstiltak],
                    stansFraOgMed: tilDato('2025-03-01'),
                    harValgtStansFraFørsteDagSomGirRett: false,
                    skalSendeVedtaksbrev: true,
                } satisfies OppdaterRevurderingStansDTO,
            ]);

        // Skjemaet lastes på nytt fra den lagrede behandlingen, og verdiene beholdes
        await expect(page.getByRole('textbox', { name: 'Stans fra og med' })).toHaveValue(
            '01.03.2025',
        );
        await expect(page.getByRole('textbox', { name: 'Begrunnelse for stans' })).toHaveValue(
            'Sluttet på tiltak',
        );

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

    test('stans fra første dag som gir rett og uten vedtaksbrev', async ({ page, msw }) => {
        const backend = lagFalskBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Opprett revurdering' }).click();
        await page.getByRole('radio', { name: 'Stans' }).check();
        await page.getByRole('button', { name: 'Opprett revurdering (Stans)' }).click();
        await forventOverskrift(page, 'Revurdering til stans av tiltakspenger');

        await page
            .getByLabel('Hjemmel for stans')
            .selectOption({ label: 'Alder - tiltakspengeforskriften § 3' });
        await page.getByRole('checkbox', { name: 'Stans fra første dag som gir rett' }).check();

        // Datoen fylles ut med første dag som gir rett, og kan ikke endres
        const stansFraOgMed = page.getByRole('textbox', { name: 'Stans fra og med' });
        await expect(stansFraOgMed).toHaveValue('01.01.2025');
        await expect(stansFraOgMed).toHaveAttribute('readonly');

        await page.getByRole('textbox', { name: 'Begrunnelse for stans' }).fill('For gammel');
        await page.getByRole('checkbox', { name: 'Ikke send vedtaksbrev' }).check();
        await expect(page.getByRole('textbox', { name: 'Tekst til vedtaksbrev' })).toHaveAttribute(
            'readonly',
        );

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect
            .poll(() => backend.tilstand.oppdaterBodies)
            .toEqual([
                {
                    resultat: RevurderingResultat.STANS,
                    begrunnelseVilkårsvurdering: 'For gammel',
                    fritekstTilVedtaksbrev: null,
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    valgteHjemler: [HjemmelForStans.Alder],
                    stansFraOgMed: null,
                    harValgtStansFraFørsteDagSomGirRett: true,
                    skalSendeVedtaksbrev: false,
                } satisfies OppdaterRevurderingStansDTO,
            ]);

        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await page.getByRole('button', { name: 'Send til beslutter' }).click();
        await page.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page).toHaveURL(personoversiktUrl, { timeout: 30_000 });
        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.tilstand.antallSendTilBeslutning).toBe(1);
    });
});
