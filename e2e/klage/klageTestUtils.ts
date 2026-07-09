import { KlagebehandlingStatus, KlageInnsendingskilde } from '~/lib/klage/typer/Klage';
import type {
    KlageId,
    Klagebehandling,
    OppdaterKlageFormkravRequest,
} from '~/lib/klage/typer/Klage';
import type { SakId, SakProps } from '~/lib/sak/SakTyper';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';

export const saksnummer = '10001';
export const sakId = 'sak_01ABC' as SakId;
export const klageId = 'klage_01ABC' as KlageId;
export const fnr = '12345678911';
export const navIdent = 'Z12345';
export const journalpostId = '453827';

export const lagInitiellKlage = (): Klagebehandling => ({
    id: klageId,
    sakId,
    saksnummer,
    fnr,
    opprettet: '2025-04-01T10:00:00',
    sistEndret: '2025-04-01T10:00:00',
    iverksattTidspunkt: null,
    saksbehandler: navIdent,
    klagensJournalpostId: journalpostId,
    klagensJournalpostOpprettet: '2025-04-01T10:00:00',
    status: KlagebehandlingStatus.UNDER_BEHANDLING,
    resultat: null,
    avbrutt: null,
    kanIverksetteVedtak: null,
    kanIverksetteOpprettholdelse: false,
    ventestatus: [],
    formkrav: {
        vedtakDetKlagesPå: null,
        erKlagerPartISaken: true,
        klagesDetPåKonkreteElementerIVedtaket: true,
        erKlagefristenOverholdt: true,
        erUnntakForKlagefrist: null,
        erKlagenSignert: true,
        innsendingsdato: '2025-04-01',
        innsendingskilde: KlageInnsendingskilde.DIGITAL,
    },
    tilknyttedeBehandlingIder: [],
    åpenBehandlingId: null,
});

export const lagSak = (klage: Klagebehandling | null): SakProps => ({
    sakId,
    saksnummer,
    fnr,
    åpneBehandlinger: [],
    meldeperiodeKjeder: [],
    behandlinger: [],
    klageBehandlinger: klage ? [klage] : [],
    tidslinje: { elementer: [] },
    innvilgetTidslinje: { elementer: [] },
    alleRammevedtak: [],
    alleKlagevedtak: [],
    utbetalingstidslinje: [],
    søknader: [],
    tilbakekrevinger: [],
    kanSendeInnHelgForMeldekort: false,
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjederV2: [],
    åpenMeldekortbehandlingId: null,
});

export const saksbehandler: Saksbehandler = {
    brukernavn: 'Test Testesen',
    epost: 'test.testesen@nav.no',
    navIdent,
    roller: [SaksbehandlerRolle.SAKSBEHANDLER, SaksbehandlerRolle.BESLUTTER],
};

export const personopplysninger: Personopplysninger = {
    fnr,
    fødselsdato: '1990-01-01',
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    fortrolig: false,
    strengtFortrolig: false,
    strengtFortroligUtland: false,
    skjermet: false,
};

/**
 * Regner ut om formkravene fører til avvisning, på samme måte som backend/`kanVurdereKlage`.
 */
export const skalAvvises = (formkrav: OppdaterKlageFormkravRequest): boolean =>
    !(
        formkrav.vedtakDetKlagesPå !== null &&
        formkrav.erKlagerPartISaken &&
        formkrav.klagesDetPåKonkreteElementerIVedtaket &&
        formkrav.erKlagefristenOverholdt &&
        formkrav.erKlagenSignert
    );
