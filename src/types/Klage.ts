import { Avbrutt } from './Avbrutt';
import { VedtakId } from './Rammevedtak';
import { Nullable } from './UtilTypes';

export type KlageId = `klage_${string}`;

export enum KlagebehandlingResultat {
    AVVIST = 'AVVIST',
}

export enum KlagebehandlingStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    AVBRUTT = 'AVBRUTT',
    IVERKSATT = 'IVERKSATT',
}

export interface Klagebehandling {
    id: KlageId;
    sakId: string;
    saksnummer: string;
    fnr: string;
    opprettet: string;
    sistEndret: string;
    saksbehandler: Nullable<string>;
    journalpostId: string;
    mottattFraJournalpost: string;
    journalpostOpprettet: string;
    status: KlagebehandlingStatus;
    resultat: Nullable<KlagebehandlingResultat>;
    vedtakDetKlagesPå: Nullable<VedtakId>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erKlagenSignert: boolean;
    brevtekst: Brevtekst[];
    avbrutt: Nullable<Avbrutt>;
    kanIverksette: boolean;
}

export interface Brevtekst {
    tittel: string;
    tekst: string;
}

export interface OpprettKlageRequest {
    journalpostId: string;
    vedtakDetKlagesPå: Nullable<string>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erKlagenSignert: boolean;
}

export interface OppdaterKlageFormkravRequest {
    journalpostId: string;
    vedtakDetKlagesPå: Nullable<string>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erKlagenSignert: boolean;
}

export interface ForhåndsvisBrevKlageRequest {
    tekstTilVedtaksbrev: Brevtekst[];
}

export interface LagreBrevtekstKlageRequest {
    tekstTilVedtaksbrev: Brevtekst[];
}
