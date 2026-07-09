import pkg from 'next/experimental/testmode/playwright/msw.js';
import { KlagebehandlingResultat, KlagebehandlingStatus } from '~/lib/klage/typer/Klage';
import type {
    KlageFormkrav,
    Klagebehandling,
    LagreBrevtekstKlageRequest,
    OpprettKlageRequest,
} from '~/lib/klage/typer/Klage';
import {
    journalpostId,
    klageId,
    lagInitiellKlage,
    lagSak,
    personopplysninger,
    saksbehandler,
    saksnummer,
    skalAvvises,
} from './klageTestUtils';
const { test, expect, http, HttpResponse } = pkg;

test.describe('Klage', () => {
    test('kan avvise en klage', async ({ page, msw }) => {
        let klage: Klagebehandling | null = null;

        msw.use(
            http.get('*/saksbehandler', () => HttpResponse.json(saksbehandler)),
            http.post('*/journalpost/valider', () =>
                HttpResponse.json({
                    journalpostFinnes: true,
                    gjelderInnsendtFnr: true,
                    datoOpprettet: '2025-04-01',
                }),
            ),
            http.get('*/sak/:sakId/personopplysninger', () =>
                HttpResponse.json(personopplysninger),
            ),
            http.post('*/sak/:sakId/klage', async ({ request }) => {
                const body = (await request.json()) as OpprettKlageRequest;

                const nyKlage = lagInitiellKlage();
                nyKlage.klagensJournalpostId = body.journalpostId;
                nyKlage.formkrav = {
                    vedtakDetKlagesPå: body.vedtakDetKlagesPå as KlageFormkrav['vedtakDetKlagesPå'],
                    erKlagerPartISaken: body.erKlagerPartISaken,
                    klagesDetPåKonkreteElementerIVedtaket:
                        body.klagesDetPåKonkreteElementerIVedtaket,
                    erKlagefristenOverholdt: body.erKlagefristenOverholdt,
                    erUnntakForKlagefrist: body.erUnntakForKlagefrist,
                    erKlagenSignert: body.erKlagenSignert,
                    innsendingsdato: body.innsendingsdato,
                    innsendingskilde: body.innsendingskilde,
                };

                if (skalAvvises(body)) {
                    nyKlage.resultat = {
                        type: KlagebehandlingResultat.AVVIST,
                        brevtekst: [],
                        begrunnelseFerdigstilling: null,
                    };
                    nyKlage.kanIverksetteVedtak = false;
                }

                klage = nyKlage;
                return HttpResponse.json(nyKlage);
            }),
            http.put('*/sak/:sakId/klage/:klageId/brevtekst', async ({ request }) => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage) return new HttpResponse(null, { status: 404 });

                const body = (await request.json()) as LagreBrevtekstKlageRequest;

                gjeldendeKlage.resultat = {
                    type: KlagebehandlingResultat.AVVIST,
                    brevtekst: body.tekstTilVedtaksbrev,
                    begrunnelseFerdigstilling: null,
                };
                gjeldendeKlage.kanIverksetteVedtak = true;
                gjeldendeKlage.sistEndret = '2025-04-03T10:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.patch('*/sak/:sakId/klage/:klageId/iverksett', () => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage) return new HttpResponse(null, { status: 404 });

                gjeldendeKlage.status = KlagebehandlingStatus.VEDTATT;
                gjeldendeKlage.iverksattTidspunkt = '2025-04-04T10:00:00';
                gjeldendeKlage.sistEndret = '2025-04-04T10:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSak(klage))),
        );

        // 1. Saksbehandler starter på personoversikten.
        await page.goto(`/sak/${saksnummer}`);

        await expect(page.getByRole('heading', { name: 'Personoversikt' })).toBeVisible({
            timeout: 60_000,
        });

        // 2. Registrer en ny klage fra personoversikten.
        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Registrer klage' }).click();

        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/opprett$`));
        await expect(page.getByRole('heading', { name: 'Formkrav' })).toBeVisible({
            timeout: 60_000,
        });

        // 3. Fyll ut skjemaet for den nye klagen (klagen er ikke signert -> avvist).
        await page.getByRole('textbox', { name: 'JournalpostId' }).fill(journalpostId);
        await page
            .getByLabel('Vedtakstype')
            .selectOption({ label: 'Har ikke klaget på et vedtak' });
        await page.getByRole('textbox', { name: 'Innsendingsdato for klagen' }).fill('01.04.2025');
        await page.getByLabel('Innsendingskilde for klagen').selectOption({ label: 'Digitalt' });
        await page
            .getByRole('radiogroup', { name: 'Er klager part i saken?' })
            .getByRole('radio', { name: 'Ja' })
            .check();
        await page
            .getByRole('radiogroup', { name: 'Klages det på konkrete elementer i vedtaket?' })
            .getByRole('radio', { name: 'Ja' })
            .check();
        await page
            .getByRole('radiogroup', { name: 'Er klagefristen overholdt?' })
            .getByRole('radio', { name: 'Ja' })
            .check();
        await page
            .getByRole('radiogroup', { name: 'Er klagen signert?' })
            .getByRole('radio', { name: 'Nei' })
            .check();

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 4. Etter opprettelse havner saksbehandler på formkrav-steget for den nye klagen.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/formkrav$`));
        await expect(page.getByRole('heading', { name: 'Formkrav' })).toBeVisible({
            timeout: 60_000,
        });

        // 5. Gå videre til brev-steget (avvist -> brev).
        await page.getByRole('button', { name: 'Fortsett' }).click();

        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/brev$`));
        await expect(page.getByRole('heading', { name: 'Brev' })).toBeVisible({ timeout: 60_000 });

        // 6. Fyll ut brevet.
        await page.getByRole('textbox', { name: 'Tittel' }).fill('Avvisning av klage');
        await page
            .getByRole('textbox', { name: 'Avsnitt 1' })
            .fill('Klagen din er avvist fordi den ikke er signert.');

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 7. Send brevet og ferdigstill behandlingen.
        const ferdigstill = page.getByRole('button', {
            name: 'Ferdigstill behandling og send brev',
        });
        await expect(ferdigstill).toBeEnabled();
        await ferdigstill.click();

        // 8. Etter iverksettelse sendes saksbehandler tilbake til personoversikten.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}$`));
        await expect(page.getByRole('heading', { name: 'Personoversikt' })).toBeVisible({
            timeout: 60_000,
        });

        // 9. Verifiser at klagen vises som avvist og vedtatt i klageoversikten.
        await page.getByRole('tab', { name: 'Klage' }).click();

        const klageTabell = page.getByRole('tabpanel', { name: 'Klage' });
        await expect(klageTabell.getByRole('cell', { name: 'Vedtatt' })).toBeVisible();
        await expect(klageTabell.getByRole('cell', { name: 'Avvist' })).toBeVisible();
    });
});
