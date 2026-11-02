import type { Locator, Page } from '@playwright/test';
import { TiltakDeltakerstatus } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import type { TiltaksdeltakelseFraRegister } from '~/lib/søknad/manuell-søknad/tiltak/useHentTiltaksdeltakelser';
import type { ValiderJournalpostResponse } from '~/lib/_felles/journalpostId/useValiderJournalpostId';
import { sak, søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { http, HttpResponse, lagPersonopplysninger } from '../felles/e2eFelles';

export const SAKSNUMMER = '202501011001';
export const REGISTRER_SØKNAD_URL = `/sak/${SAKSNUMMER}/registrer-soknad`;
export const JOURNALPOST_ID = '123456789';

export const lagSak = () => sak();

/** Søknadsbehandlingen backend svarer med når papirsøknaden er registrert */
export const lagOpprettetBehandling = () => søknadsbehandlingIkkeValgt({ id: 'beh_ny' });

export const lagTiltaksdeltakelser = (): TiltaksdeltakelseFraRegister[] => [
    {
        eksternDeltakelseId: 'ekstern_1',
        typeKode: 'GRUPPE_AMO',
        typeNavn: 'Gruppe AMO',
        visningsnavn: ikkeSladdet('Gruppe AMO hos Arrangør AS'),
        status: TiltakDeltakerstatus.DELTAR,
        periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-06-30' },
        fratarRett: false,
    },
    {
        eksternDeltakelseId: 'ekstern_lonnstilskudd',
        typeKode: null,
        typeNavn: 'Lønnstilskudd',
        visningsnavn: ikkeSladdet('Lønnstilskudd hos Bedrift AS'),
        status: TiltakDeltakerstatus.DELTAR,
        periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-06-30' },
        fratarRett: true,
    },
];

export const lagBarn = () => [
    lagPersonopplysninger({
        fnr: ikkeSladdet('05051512345'),
        fødselsdato: ikkeSladdet('2015-05-05'),
        fornavn: ikkeSladdet('Kari'),
        etternavn: ikkeSladdet('Nordmann'),
    }),
    lagPersonopplysninger({
        fnr: ikkeSladdet('06061812345'),
        fødselsdato: ikkeSladdet('2018-06-06'),
        fornavn: ikkeSladdet('Per'),
        etternavn: ikkeSladdet('Nordmann'),
    }),
];

export type Opptak = {
    validerJournalpost: unknown[];
    tiltaksdeltakelserQuery: string[];
    opprettSøknad: unknown[];
};

export const lagOpptak = (): Opptak => ({
    validerJournalpost: [],
    tiltaksdeltakelserQuery: [],
    opprettSøknad: [],
});

type HandlerValg = {
    opptak: Opptak;
    journalpost?: ValiderJournalpostResponse;
    opprettSøknadRespons?: () => Response;
};

/** Handlere for registrer-søknad-siden. Legg `...fellesHandlere()` etter disse i `msw.use`. */
export const papirsøknadHandlere = ({ opptak, journalpost, opprettSøknadRespons }: HandlerValg) => [
    http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSak())),
    http.post('*/journalpost/valider', async ({ request }) => {
        opptak.validerJournalpost.push(await request.json());
        return HttpResponse.json(
            journalpost ?? {
                journalpostFinnes: true,
                gjelderInnsendtFnr: true,
                datoOpprettet: '2025-04-02',
            },
        );
    }),
    http.get('*/sak/:sakId/tiltaksdeltakelser', ({ request }) => {
        opptak.tiltaksdeltakelserQuery.push(new URL(request.url).search);
        return HttpResponse.json(lagTiltaksdeltakelser());
    }),
    http.get('*/sak/:sakId/personopplysninger/barn', () => HttpResponse.json(lagBarn())),
    http.post('*/sak/:saksnummer/soknad', async ({ request }) => {
        opptak.opprettSøknad.push(await request.json());
        return opprettSøknadRespons
            ? opprettSøknadRespons()
            : HttpResponse.json(lagOpprettetBehandling());
    }),
];

export const radioIGruppe = (scope: Page | Locator, gruppe: string | RegExp, svar: string) =>
    scope
        .getByRole('radiogroup', { name: gruppe, exact: true })
        .getByRole('radio', { name: svar, exact: true });

export const svarPå = async (page: Page, gruppe: string | RegExp, svar: string) =>
    radioIGruppe(page, gruppe, svar).check();

export const INSTITUSJON_SPØRSMÅL = /^Bor bruker i en institusjon med gratis opphold/;

/** Fyller ut feltene som alltid er påkrevd for en vanlig (ikke-Arena) papirsøknad */
export const fyllUtGrunnleggendeFelter = async (page: Page) => {
    await page.getByRole('textbox', { name: 'JournalpostId' }).fill(JOURNALPOST_ID);
    await page.getByRole('combobox', { name: 'Søknadstype' }).selectOption('PAPIR_SKJEMA');
    await page
        .getByRole('textbox', { name: 'Velg datoen søknaden ble mottatt' })
        .fill('02.04.2025');
    await svarPå(page, 'Overført fra Arena?', 'Nei');
    await page.getByRole('textbox', { name: 'Fra og med' }).first().fill('01.04.2025');
    await page.getByRole('textbox', { name: 'Til og med' }).first().fill('30.06.2025');
};

/** Svarer Nei på alle ja/nei-spørsmålene om ytelser */
export const svarNeiPåYtelser = async (page: Page) => {
    await svarPå(page, 'Mottar kvalifiseringsstønad', 'Nei');
    await svarPå(page, 'Mottar introduksjonsstønad', 'Nei');
    await svarPå(page, 'Mottar etterlønn', 'Nei');
    await svarPå(page, 'Har nylig mottatt sykepenger og er fortsatt sykemeldt', 'Nei');
    await svarPå(page, 'Mottar noen av pengestøttene', 'Nei');
    await svarPå(page, INSTITUSJON_SPØRSMÅL, 'Nei');
};
