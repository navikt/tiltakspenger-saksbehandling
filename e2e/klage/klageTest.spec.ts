import pkg from 'next/experimental/testmode/playwright/msw.js';
import { KlagebehandlingResultat, KlagebehandlingStatus } from '~/lib/klage/typer/Klage';
import type {
    KlageFormkrav,
    Klagebehandling,
    LagreBrevtekstKlageRequest,
    OpprettKlageRequest,
    VurderKlageRequest,
} from '~/lib/klage/typer/Klage';
import { KlageHendelseKlagebehandlingAvsluttetUtfall } from '~/lib/klage/typer/Klageinstanshendelse';
import type { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { klageTestUtils } from './klageTestUtils';

const {
    journalpostId,
    klageId,
    lagInitiellKlage,
    lagOmgjøringsbehandling,
    lagSak,
    lagSøknad,
    omgjøringsbehandlingId,
    personopplysninger,
    saksbehandler,
    saksnummer,
    simulerSvarFraKlageinstans,
    skalAvvises,
    søknadId,
    vedtakId,
} = klageTestUtils;
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

    test('kan opprettholde en klage', async ({ page, msw }) => {
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

                klage = nyKlage;
                return HttpResponse.json(nyKlage);
            }),
            http.patch('*/sak/:sakId/klage/:klageId/vurder', async ({ request }) => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage) return new HttpResponse(null, { status: 404 });

                const body = (await request.json()) as VurderKlageRequest;

                gjeldendeKlage.resultat = {
                    type: KlagebehandlingResultat.OPPRETTHOLDT,
                    brevtekst: [],
                    hjemler: body.hjemler ?? [],
                    iverksattOpprettholdelseTidspunkt: null,
                    journalføringstidspunktInnstillingsbrev: null,
                    distribusjonstidspunktInnstillingsbrev: null,
                    oversendtKlageinstansenTidspunkt: null,
                    klageinstanshendelser: [],
                    ferdigstiltTidspunkt: null,
                    journalpostIdInnstillingsbrev: null,
                    dokumentInfoIder: null,
                    begrunnelseFerdigstilling: null,
                };
                gjeldendeKlage.sistEndret = '2025-04-03T10:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.put('*/sak/:sakId/klage/:klageId/brevtekst', async ({ request }) => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage || gjeldendeKlage.resultat?.type !== 'OPPRETTHOLDT') {
                    return new HttpResponse(null, { status: 404 });
                }

                const body = (await request.json()) as LagreBrevtekstKlageRequest;

                gjeldendeKlage.resultat = {
                    ...gjeldendeKlage.resultat,
                    brevtekst: body.tekstTilVedtaksbrev,
                };
                gjeldendeKlage.kanIverksetteOpprettholdelse = true;
                gjeldendeKlage.sistEndret = '2025-04-03T11:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.patch('*/sak/:sakId/klage/:klageId/oppretthold', () => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage || gjeldendeKlage.resultat?.type !== 'OPPRETTHOLDT') {
                    return new HttpResponse(null, { status: 404 });
                }

                gjeldendeKlage.status = KlagebehandlingStatus.OPPRETTHOLDT;
                gjeldendeKlage.resultat = {
                    ...gjeldendeKlage.resultat,
                    iverksattOpprettholdelseTidspunkt: '2025-04-04T10:00:00',
                };
                gjeldendeKlage.sistEndret = '2025-04-04T10:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.patch('*/sak/:sakId/klage/:klageId/ferdigstill', () => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage || gjeldendeKlage.resultat?.type !== 'OPPRETTHOLDT') {
                    return new HttpResponse(null, { status: 404 });
                }

                gjeldendeKlage.status = KlagebehandlingStatus.FERDIGSTILT;
                gjeldendeKlage.resultat = {
                    ...gjeldendeKlage.resultat,
                    ferdigstiltTidspunkt: '2025-04-08T10:00:00',
                };
                gjeldendeKlage.sistEndret = '2025-04-08T10:00:00';

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

        // 3. Fyll ut skjemaet. Klagen er signert og klages på et rammevedtak -> kan vurderes.
        await page.getByRole('textbox', { name: 'JournalpostId' }).fill(journalpostId);
        await page.getByLabel('Vedtakstype').selectOption({ label: 'Rammevedtak' });
        await page.getByLabel('Vedtaket som er påklaget').selectOption(vedtakId);
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
            .getByRole('radio', { name: 'Ja' })
            .check();

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 4. Etter opprettelse havner saksbehandler på formkrav-steget for den nye klagen.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/formkrav$`));
        await expect(page.getByRole('heading', { name: 'Formkrav' })).toBeVisible({
            timeout: 60_000,
        });

        // 5. Gå videre til vurderingssteget (formkrav oppfylt -> vurdering).
        await page.getByRole('button', { name: 'Fortsett' }).click();

        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/vurdering$`));
        await expect(page.getByRole('heading', { name: 'Vurdering' })).toBeVisible({
            timeout: 60_000,
        });

        // 6. Velg å opprettholde vedtaket og velg minst én hjemmel.
        await page.getByLabel('Vedtak').selectOption({ label: 'Oppretthold vedtak' });

        const hjemler = page.getByRole('combobox', { name: 'Hjemler' });
        await hjemler.click();
        await page.getByRole('option', { name: 'Forvaltningsloven §28', exact: true }).click();

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 7. Etter lagret vurdering kan saksbehandler gå videre til brev-steget.
        const fortsettTilBrev = page.getByRole('button', { name: 'Fortsett' });
        await expect(fortsettTilBrev).toBeVisible();
        await fortsettTilBrev.click();

        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/brev$`));
        await expect(page.getByRole('heading', { name: 'Brev' })).toBeVisible({ timeout: 60_000 });

        // 8. Fyll ut de tomme avsnittene i innstillingsbrevet.
        await page
            .getByRole('textbox', { name: 'Avsnitt 2' })
            .fill('Klager anfører at vedtaket er feil.');
        await page
            .getByRole('textbox', { name: 'Avsnitt 3' })
            .fill('Etter en samlet vurdering opprettholdes vedtaket.');

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 9. Ferdigstill behandlingen og send innstillingsbrevet.
        const ferdigstill = page.getByRole('button', {
            name: 'Ferdigstill behandling og send brev',
        });
        await expect(ferdigstill).toBeEnabled();
        await ferdigstill.click();

        // 10. Etter iverksatt opprettholdelse havner saksbehandler på resultat-steget.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/resultat$`));
        await expect(page.getByRole('heading', { name: 'Resultat' })).toBeVisible({
            timeout: 60_000,
        });
        await expect(
            page.getByRole('listitem').filter({ hasText: 'Iverksettelse av opprettholdelse' }),
        ).toBeVisible();

        // 11. Nav Klageinstans behandler saken og stadfester innstillingen. Vi simulerer
        //     svaret fra klageinstansen og laster resultat-steget på nytt.
        simulerSvarFraKlageinstans(
            klage!,
            KlageHendelseKlagebehandlingAvsluttetUtfall.STADFESTELSE,
        );
        await page.reload();

        // 12. Resultat-steget viser nå utfallet fra klageinstansen.
        await expect(page.getByRole('heading', { name: 'Resultat' })).toBeVisible({
            timeout: 60_000,
        });
        await expect(
            page.getByRole('listitem').filter({ hasText: 'Overført til Nav Klageinstans' }),
        ).toBeVisible();
        await expect(page.getByText('Stadfestelse', { exact: true })).toBeVisible();

        // 13. Saksbehandler ferdigstiller klagen etter svaret fra klageinstansen.
        await page.getByRole('button', { name: 'Ferdigstill klagen' }).click();

        const ferdigstillModal = page.getByRole('dialog');
        await ferdigstillModal
            .getByRole('textbox', { name: 'Begrunnelse for ferdigstilling av klage' })
            .fill('Klageinstansen stadfestet vedtaket, klagen ferdigstilles.');
        await ferdigstillModal.getByRole('button', { name: 'Ferdigstill klagen' }).click();

        // 14. Etter ferdigstilling sendes saksbehandler tilbake til personoversikten.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}$`));
        await expect(page.getByRole('heading', { name: 'Personoversikt' })).toBeVisible({
            timeout: 60_000,
        });

        // 15. Verifiser at klagen vises som ferdigstilt og opprettholdt i klageoversikten.
        await page.getByRole('tab', { name: 'Klage' }).click();

        const klageTabell = page.getByRole('tabpanel', { name: 'Klage' });
        await expect(klageTabell.getByRole('cell', { name: 'Ferdigstilt' })).toBeVisible();
        await expect(klageTabell.getByRole('cell', { name: 'Opprettholdt' })).toBeVisible();
        await expect(klageTabell.getByRole('cell', { name: 'Stadfestelse' })).toBeVisible();
    });

    test('kan omgjøre en klage', async ({ page, msw }) => {
        let klage: Klagebehandling | null = null;
        let omgjøringsbehandling: Rammebehandling | null = null;

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

                klage = nyKlage;
                return HttpResponse.json(nyKlage);
            }),
            http.patch('*/sak/:sakId/klage/:klageId/vurder', async ({ request }) => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage) return new HttpResponse(null, { status: 404 });

                const body = (await request.json()) as VurderKlageRequest;

                gjeldendeKlage.resultat = {
                    type: KlagebehandlingResultat.OMGJØR,
                    årsak: body.årsak!,
                    begrunnelse: body.begrunnelse ?? '',
                    begrunnelseFerdigstilling: null,
                    ferdigstiltTidspunkt: null,
                };
                gjeldendeKlage.sistEndret = '2025-04-03T10:00:00';

                return HttpResponse.json(gjeldendeKlage);
            }),
            http.post('*/sak/:sakId/klage/:klageId/opprettBehandling', () => {
                const gjeldendeKlage = klage;
                if (!gjeldendeKlage || gjeldendeKlage.resultat?.type !== 'OMGJØR') {
                    return new HttpResponse(null, { status: 404 });
                }

                const nyBehandling = lagOmgjøringsbehandling();
                omgjøringsbehandling = nyBehandling;
                gjeldendeKlage.åpenBehandlingId = nyBehandling.id;
                gjeldendeKlage.tilknyttedeBehandlingIder = [nyBehandling.id];

                return HttpResponse.json(nyBehandling);
            }),
            http.get('*/sak/:saksnummer', () => {
                const sak = lagSak(klage, { søknader: [lagSøknad()] });
                if (omgjøringsbehandling) {
                    sak.rammebehandlinger = [...sak.rammebehandlinger, omgjøringsbehandling];
                }
                return HttpResponse.json(sak);
            }),
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

        // 3. Fyll ut skjemaet. Klagen er signert og klages på et rammevedtak -> kan vurderes.
        await page.getByRole('textbox', { name: 'JournalpostId' }).fill(journalpostId);
        await page.getByLabel('Vedtakstype').selectOption({ label: 'Rammevedtak' });
        await page.getByLabel('Vedtaket som er påklaget').selectOption(vedtakId);
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
            .getByRole('radio', { name: 'Ja' })
            .check();

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 4. Etter opprettelse havner saksbehandler på formkrav-steget for den nye klagen.
        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/formkrav$`));
        await expect(page.getByRole('heading', { name: 'Formkrav' })).toBeVisible({
            timeout: 60_000,
        });

        // 5. Gå videre til vurderingssteget (formkrav oppfylt -> vurdering).
        await page.getByRole('button', { name: 'Fortsett' }).click();

        await expect(page).toHaveURL(new RegExp(`/sak/${saksnummer}/klage/${klageId}/vurdering$`));
        await expect(page.getByRole('heading', { name: 'Vurdering' })).toBeVisible({
            timeout: 60_000,
        });

        // 6. Velg å omgjøre vedtaket, med årsak og begrunnelse.
        await page.getByLabel('Vedtak').selectOption({ label: 'Omgjør vedtak' });
        await page.getByLabel('Årsak').selectOption({ label: 'Feil eller endret fakta' });
        await page
            .getByRole('textbox', { name: 'Begrunnelse' })
            .fill('Nye opplysninger viser at vedtaket er feil og må omgjøres.');

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        // 7. Etter lagret vurdering vises omgjøringsresultatet.
        await expect(page.getByText('Omgjøring av vedtak')).toBeVisible();

        // 8. Saksbehandler oppretter en ny omgjøringsbehandling for klagen.
        await page.getByRole('button', { name: 'Opprett ny behandling' }).click();

        const omgjøringsmodal = page.getByRole('dialog', { name: 'Velg omgjøringsbehandling' });
        await omgjøringsmodal
            .getByLabel('Behandlingstype')
            .selectOption({ label: 'Søknadsbehandling' });
        await omgjøringsmodal.getByLabel('Velg søknad').selectOption(søknadId);
        await omgjøringsmodal.getByRole('button', { name: 'Opprett omgjøringsbehandling' }).click();

        // 9. Saksbehandler havner på den nye omgjøringsbehandlingen, som viser informasjon
        //    fra klagen (årsak og begrunnelse for omgjøringen).
        await expect(page).toHaveURL(
            new RegExp(`/sak/${saksnummer}/behandling/${omgjøringsbehandlingId}$`),
        );
        await expect(
            page.getByRole('heading', {
                name: 'Omgjøring etter klage - Vedtak (søknadsbehandling)',
            }),
        ).toBeVisible({ timeout: 60_000 });
        await expect(page.getByRole('heading', { name: 'Informasjon om klagen' })).toBeVisible();
        await expect(
            page.getByText('Nye opplysninger viser at vedtaket er feil og må omgjøres.'),
        ).toBeVisible();
    });
});
