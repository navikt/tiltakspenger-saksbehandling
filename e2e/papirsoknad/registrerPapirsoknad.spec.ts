import type { Page } from '@playwright/test';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    test,
} from '../felles/e2eFelles';
import {
    fyllUtGrunnleggendeFelter,
    INSTITUSJON_SPØRSMÅL,
    JOURNALPOST_ID,
    lagOpptak,
    lagOpprettetBehandling,
    papirsøknadHandlere,
    radioIGruppe,
    REGISTRER_SØKNAD_URL,
    SAKSNUMMER,
    svarNeiPåYtelser,
    svarPå,
} from './papirsoknadTestUtils';

type SøknadBody = Record<string, unknown> & { svar: Record<string, unknown> };

const OVERSKRIFT = 'Manuell registrering av søknad';

/** Første navigering til en side kompileres av dev-serveren og kan ta tid når mange tester kjører samtidig */
const NAVIGASJON_TIMEOUT = 30_000;

const åpneRegistrerSøknad = async (page: Page) => {
    await page.goto(REGISTRER_SØKNAD_URL);
    await forventOverskrift(page, OVERSKRIFT);
};

const ventPåGodkjentJournalpost = async (page: Page) => {
    await expect(page.getByText('Journalpost finnes og tilhører søker.')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Opprettet (fra journalpost)' })).toHaveValue(
        '02.04.2025',
    );
};

/** Minste gyldige utfylling: ikke fra Arena, ikke søkt tiltak/barnetillegg, Nei på alle ytelser */
const fyllUtMinimalSøknad = async (page: Page) => {
    await fyllUtGrunnleggendeFelter(page);
    await ventPåGodkjentJournalpost(page);
    await svarPå(page, 'Har søkt på tiltak?', 'Nei');
    await svarNeiPåYtelser(page);
    await svarPå(page, 'Har bruker søkt barnetillegg?', 'Nei');
};

test.describe('Registrere papirsøknad', () => {
    test('åpnes fra «Opprett behandling» på personoversikten', async ({ page, msw }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Registrer søknad manuelt' }).click();

        await expect(page).toHaveURL(new RegExp(`${REGISTRER_SØKNAD_URL}$`), {
            timeout: NAVIGASJON_TIMEOUT,
        });
        await forventOverskrift(page, OVERSKRIFT);
        await expect(page.getByRole('button', { name: 'Start behandling' })).toBeVisible();
        expect(opptak.opprettSøknad).toHaveLength(0);
    });

    test('fyller ut hele skjemaet med tiltak og barn, sender inn og går til behandlingen', async ({
        page,
        msw,
    }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await åpneRegistrerSøknad(page);

        await fyllUtGrunnleggendeFelter(page);
        await ventPåGodkjentJournalpost(page);
        await expect
            .poll(() => opptak.validerJournalpost)
            .toContainEqual({ fnr: '12345678911', journalpostId: JOURNALPOST_ID });

        // Tiltak hentes for søknadsperioden; tiltak som fratar rett kan ikke velges
        await svarPå(page, 'Har søkt på tiltak?', 'Ja');
        await page.getByRole('button', { name: 'Finn tiltak' }).click();
        await expect
            .poll(() => opptak.tiltaksdeltakelserQuery)
            .toContain('?fraOgMed=2025-04-01&tilOgMed=2025-06-30');
        await expect(page.getByText('Tiltak som kan frata rett til tiltakspenger')).toBeVisible();
        await expect(page.getByRole('radio', { name: /Lønnstilskudd/ })).toHaveCount(0);
        await radioIGruppe(
            page,
            'Velg tiltak',
            'Gruppe AMO hos Arrangør AS (01.04.2025 - 30.06.2025, Deltar)',
        ).check();

        await svarNeiPåYtelser(page);

        // Barn fra folkeregisteret: søkt for det ene, ikke det andre
        await svarPå(page, 'Har bruker søkt barnetillegg?', 'Ja');
        await page.getByRole('button', { name: 'Legg til barn fra folkeregisteret' }).click();
        await expect(
            page.getByRole('heading', { name: 'Kari Nordmann - født 05.05.2015' }),
        ).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Per Nordmann - født 06.06.2018' }),
        ).toBeVisible();

        const barnSpørsmål = page.getByRole('radiogroup', { name: 'Er søkt om barnetillegg for?' });
        await barnSpørsmål.nth(0).getByRole('radio', { name: 'Ja', exact: true }).check();
        await barnSpørsmål.nth(1).getByRole('radio', { name: 'Nei', exact: true }).check();
        await expect(
            page.getByRole('radiogroup', { name: 'Oppholdssted i tiltaksperioden' }),
        ).toHaveCount(1);
        await svarPå(page, 'Oppholdssted i tiltaksperioden', 'Norge');

        await page.getByRole('button', { name: 'Start behandling' }).click();

        await expect
            .poll(() => opptak.opprettSøknad, { timeout: NAVIGASJON_TIMEOUT })
            .toHaveLength(1);
        const body = opptak.opprettSøknad[0] as SøknadBody;
        expect(body).toMatchObject({
            journalpostId: JOURNALPOST_ID,
            søknadstype: 'PAPIR_SKJEMA',
            overfortFraArena: 'NEI',
            manueltSattSøknadMottattDato: '2025-04-02',
            manueltSattSøknadsperiode: { fraOgMed: '2025-04-01', tilOgMed: '2025-06-30' },
            antallVedlegg: 0,
            svar: {
                harSøktPåTiltak: { svar: 'JA' },
                tiltak: {
                    eksternDeltakelseId: 'ekstern_1',
                    deltakelseFraOgMed: '2025-04-01',
                    deltakelseTilOgMed: '2025-06-30',
                    typeKode: 'GRUPPE_AMO',
                    typeNavn: 'Gruppe AMO',
                },
                kvp: { svar: 'NEI' },
                intro: { svar: 'NEI' },
                etterlønn: { svar: 'NEI' },
                sykepenger: { svar: 'NEI' },
                institusjon: { svar: 'NEI' },
                mottarAndreUtbetalinger: 'NEI',
                gjenlevendepensjon: { svar: 'NEI' },
                alderspensjon: { svar: 'NEI' },
                supplerendeStønadAlder: { svar: 'NEI' },
                supplerendeStønadFlyktning: { svar: 'NEI' },
                trygdOgPensjon: { svar: 'NEI' },
                jobbsjansen: { svar: 'NEI' },
                harSøktOmBarnetillegg: { svar: 'JA' },
                barnetilleggManuelle: [],
            },
        });
        expect(body.behandlingsarsak).toBeUndefined();

        // Bare barnet det er søkt barnetillegg for sendes inn
        expect(body.svar.barnetilleggPdl).toEqual([
            expect.objectContaining({
                fornavn: 'Kari',
                etternavn: 'Nordmann',
                fødselsdato: '2015-05-05',
                fnr: '05051512345',
                erSøktBarnetilleggFor: { svar: 'JA' },
                oppholdssted: { svar: 'NORGE' },
            }),
        ]);

        await expect(page).toHaveURL(new RegExp(`/sak/${SAKSNUMMER}/behandling/beh_ny$`), {
            timeout: NAVIGASJON_TIMEOUT,
        });
    });

    test('overført fra Arena (forlengelse) skjuler mottatt-dato og forhåndsutfyller ytelsene med Nei', async ({
        page,
        msw,
    }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await åpneRegistrerSøknad(page);

        await page.getByRole('textbox', { name: 'JournalpostId' }).fill(JOURNALPOST_ID);
        await ventPåGodkjentJournalpost(page);
        await page.getByRole('combobox', { name: 'Søknadstype' }).selectOption('PAPIR_FRIHAND');

        const mottattDato = page.getByRole('textbox', { name: 'Velg datoen søknaden ble mottatt' });
        await mottattDato.fill('02.04.2025');

        await svarPå(page, 'Overført fra Arena?', 'Ja');
        await expect(mottattDato).toBeHidden();

        await page
            .getByRole('combobox', { name: 'Behandlingsårsak' })
            .selectOption({ label: 'Forlengelse fra Arena' });

        for (const spørsmål of [
            'Mottar kvalifiseringsstønad',
            'Mottar introduksjonsstønad',
            'Mottar etterlønn',
            'Har nylig mottatt sykepenger og er fortsatt sykemeldt',
            'Mottar noen av pengestøttene',
        ]) {
            await expect(radioIGruppe(page, spørsmål, 'Nei')).toBeChecked();
        }
        await expect(radioIGruppe(page, INSTITUSJON_SPØRSMÅL, 'Nei')).toBeChecked();

        await page.getByRole('textbox', { name: 'Fra og med' }).first().fill('01.04.2025');
        await page.getByRole('textbox', { name: 'Til og med' }).first().fill('30.06.2025');
        await svarPå(page, 'Har søkt på tiltak?', 'Nei');
        await svarPå(page, 'Har bruker søkt barnetillegg?', 'Nei');

        await page.getByRole('button', { name: 'Start behandling' }).click();

        await expect
            .poll(() => opptak.opprettSøknad, { timeout: NAVIGASJON_TIMEOUT })
            .toHaveLength(1);
        const body = opptak.opprettSøknad[0] as SøknadBody;
        expect(body).toMatchObject({
            journalpostId: JOURNALPOST_ID,
            søknadstype: 'PAPIR_FRIHAND',
            overfortFraArena: 'JA',
            behandlingsarsak: 'FORLENGELSE_FRA_ARENA',
            manueltSattSøknadsperiode: { fraOgMed: '2025-04-01', tilOgMed: '2025-06-30' },
            svar: {
                harSøktPåTiltak: { svar: 'NEI' },
                kvp: { svar: 'NEI' },
                intro: { svar: 'NEI' },
                etterlønn: { svar: 'NEI' },
                sykepenger: { svar: 'NEI' },
                institusjon: { svar: 'NEI' },
                mottarAndreUtbetalinger: 'NEI',
                jobbsjansen: { svar: 'NEI' },
                harSøktOmBarnetillegg: { svar: 'NEI' },
                barnetilleggPdl: [],
            },
        });
        // Mottatt-dato settes av backend fra journalposten ved overføring fra Arena
        expect(body.manueltSattSøknadMottattDato).toBeUndefined();
        expect(body.svar.tiltak).toBeUndefined();

        await expect(page).toHaveURL(new RegExp(`/sak/${SAKSNUMMER}/behandling/beh_ny$`), {
            timeout: NAVIGASJON_TIMEOUT,
        });
    });

    test('viser valideringsfeil og sender ikke inn et ufullstendig skjema', async ({
        page,
        msw,
    }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await åpneRegistrerSøknad(page);
        await page.getByRole('button', { name: 'Start behandling' }).click();

        await expect(page.getByText('JournalpostId er påkrevd.')).toBeVisible();
        await expect(page.getByText('Søknadstype er påkrevd')).toBeVisible();
        await expect(page.getByText('Dato for når søknaden ble mottatt er påkrevd.')).toBeVisible();
        await expect(page.getByText('Fra og med er påkrevd.')).toBeVisible();
        await expect(page.getByText('Til og med er påkrevd.')).toBeVisible();
        // Overført fra Arena, tiltak, kvp, intro, etterlønn, sykepenger, pengestøtter, institusjon og barnetillegg
        await expect(page.getByText('Du må velge et svar.')).toHaveCount(9);

        // Ugyldig periode: til og med før fra og med
        await page.getByRole('textbox', { name: 'Fra og med' }).first().fill('30.06.2025');
        await page.getByRole('textbox', { name: 'Til og med' }).first().fill('01.04.2025');
        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect(page.getByText('Ugyldig periode.')).toBeVisible();

        // Behandlingsårsak blir påkrevd når søknaden er overført fra Arena
        await svarPå(page, 'Overført fra Arena?', 'Ja');
        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect(page.getByText('Behandlingsårsak er påkrevd')).toBeVisible();
        await expect(page.getByText('Dato for når søknaden ble mottatt er påkrevd.')).toBeHidden();

        // Barn fra folkeregisteret må besvares hver for seg
        await svarPå(page, 'Har bruker søkt barnetillegg?', 'Ja');
        await page.getByRole('button', { name: 'Legg til barn fra folkeregisteret' }).click();
        await expect(
            page.getByRole('heading', { name: 'Kari Nordmann - født 05.05.2015' }),
        ).toBeVisible();
        const errorsFør = await page.getByText('Du må velge et svar.').count();
        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect(page.getByText('Du må velge et svar.')).toHaveCount(errorsFør + 2);

        await expect(page).toHaveURL(new RegExp(`${REGISTRER_SØKNAD_URL}$`));
        expect(opptak.opprettSøknad).toHaveLength(0);
    });

    test('validerer journalpostId mot backend', async ({ page, msw }) => {
        const opptak = lagOpptak();
        msw.use(
            http.post('*/journalpost/valider', async ({ request }) => {
                const body = (await request.json()) as { fnr: string; journalpostId: string };
                opptak.validerJournalpost.push(body);
                switch (body.journalpostId) {
                    case '11111':
                        return HttpResponse.json({ journalpostFinnes: false });
                    case '22222':
                        return HttpResponse.json({
                            journalpostFinnes: true,
                            gjelderInnsendtFnr: false,
                            datoOpprettet: '2025-03-01',
                        });
                    default:
                        return HttpResponse.json({
                            journalpostFinnes: true,
                            gjelderInnsendtFnr: true,
                            datoOpprettet: '2025-04-02',
                        });
                }
            }),
            ...papirsøknadHandlere({ opptak }),
            ...fellesHandlere(),
        );

        await åpneRegistrerSøknad(page);
        const journalpostId = page.getByRole('textbox', { name: 'JournalpostId' });

        await journalpostId.fill('12ab');
        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect(page.getByText('JournalpostId kan kun inneholde tall.')).toBeVisible();

        await journalpostId.fill('1234');
        await expect(page.getByText('JournalpostId må inneholde minst 5 tegn.')).toBeVisible();

        await journalpostId.fill('11111');
        await expect(page.getByText('Journalpost finnes ikke.')).toBeVisible();

        await journalpostId.fill('22222');
        await expect(
            page.getByText('Journalposten tilhører en annen person enn søker.'),
        ).toBeVisible();
        // Opprettet-datoen vises bare når journalposten tilhører søker
        await expect(
            page.getByRole('textbox', { name: 'Opprettet (fra journalpost)' }),
        ).not.toHaveValue('01.03.2025');

        await journalpostId.fill(JOURNALPOST_ID);
        await ventPåGodkjentJournalpost(page);
        await expect(
            page.getByText('Journalposten tilhører en annen person enn søker.'),
        ).toBeHidden();

        // Korte/ugyldige id-er valideres ikke mot backend
        expect(opptak.validerJournalpost).toEqual([
            { fnr: '12345678911', journalpostId: '11111' },
            { fnr: '12345678911', journalpostId: '22222' },
            { fnr: '12345678911', journalpostId: JOURNALPOST_ID },
        ]);
        expect(opptak.opprettSøknad).toHaveLength(0);
    });

    test('«Avbryt» går tilbake til personoversikten uten å sende inn', async ({ page, msw }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await åpneRegistrerSøknad(page);
        await fyllUtGrunnleggendeFelter(page);
        await ventPåGodkjentJournalpost(page);

        await page.getByRole('button', { name: 'Avbryt' }).click();

        await expect(page).toHaveURL(new RegExp(`/sak/${SAKSNUMMER}$`), {
            timeout: NAVIGASJON_TIMEOUT,
        });
        await forventOverskrift(page, 'Personoversikt');
        await expect(page.getByText('Du må velge et svar.')).toHaveCount(0);
        expect(opptak.opprettSøknad).toHaveLength(0);
    });

    test('viser feilmeldingen fra backend ved 400', async ({ page, msw }) => {
        const opptak = lagOpptak();
        msw.use(
            ...papirsøknadHandlere({
                opptak,
                opprettSøknadRespons: () =>
                    HttpResponse.json(
                        {
                            melding: `Journalpost ${JOURNALPOST_ID} tilhører en annen bruker.`,
                            kode: 'journalpost_tilhører_en_annen_bruker',
                        },
                        { status: 400 },
                    ),
            }),
            ...fellesHandlere(),
        );

        await åpneRegistrerSøknad(page);
        await fyllUtMinimalSøknad(page);
        await page.getByRole('button', { name: 'Start behandling' }).click();

        await expect(
            page.getByText(`Journalpost ${JOURNALPOST_ID} tilhører en annen bruker.`),
        ).toBeVisible();
        expect(opptak.opprettSøknad).toHaveLength(1);
        await expect(page).toHaveURL(new RegExp(`${REGISTRER_SØKNAD_URL}$`));
    });

    test('viser generell feilmelding ved serverfeil, og kan prøve igjen', async ({ page, msw }) => {
        const opptak = lagOpptak();
        let antallKall = 0;
        msw.use(
            ...papirsøknadHandlere({
                opptak,
                opprettSøknadRespons: () => {
                    antallKall++;
                    return antallKall === 1
                        ? HttpResponse.json(
                              { melding: 'Noe gikk galt', kode: 'server_feil' },
                              { status: 500 },
                          )
                        : HttpResponse.json(lagOpprettetBehandling());
                },
            }),
            ...fellesHandlere(),
        );

        await åpneRegistrerSøknad(page);
        await fyllUtMinimalSøknad(page);
        await page.getByRole('button', { name: 'Start behandling' }).click();

        await expect(
            page.getByText(
                'Noe gikk galt ved registrering av papirsøknad. Vennligst prøv igjen litt senere.',
            ),
        ).toBeVisible();
        await expect(page).toHaveURL(new RegExp(`${REGISTRER_SØKNAD_URL}$`));

        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect
            .poll(() => opptak.opprettSøknad, { timeout: NAVIGASJON_TIMEOUT })
            .toHaveLength(2);
        await expect(page).toHaveURL(new RegExp(`/sak/${SAKSNUMMER}/behandling/beh_ny$`), {
            timeout: NAVIGASJON_TIMEOUT,
        });
    });

    test('sender perioden for et ja-svar i formatet backend forventer', async ({ page, msw }) => {
        const opptak = lagOpptak();
        msw.use(...papirsøknadHandlere({ opptak }), ...fellesHandlere());

        await åpneRegistrerSøknad(page);
        await fyllUtMinimalSøknad(page);

        await svarPå(page, 'Mottar kvalifiseringsstønad', 'Ja');
        await page.getByRole('textbox', { name: 'Fra og med' }).nth(1).fill('01.04.2025');
        await page.getByRole('textbox', { name: 'Til og med' }).nth(1).fill('30.04.2025');

        await page.getByRole('button', { name: 'Start behandling' }).click();
        await expect
            .poll(() => opptak.opprettSøknad, { timeout: NAVIGASJON_TIMEOUT })
            .toHaveLength(1);

        const body = opptak.opprettSøknad[0] as SøknadBody;
        expect(body.svar.kvp).toEqual({
            svar: 'JA',
            periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
        });
    });
});
