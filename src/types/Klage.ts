import { Avbrutt } from './Avbrutt';
import { BehandlingId } from './Rammebehandling';
import { VedtakId } from './Rammevedtak';
import { Nullable } from './UtilTypes';
import { VentestatusHendelse } from './Ventestatus';
import { Klagevedtak } from '~/types/Klagevedtak';

export type KlageId = `klage_${string}`;

export enum KlagebehandlingResultat {
    AVVIST = 'AVVIST',
    OMGJØR = 'OMGJØR',
    OPPRETTHOLDT = 'OPPRETTHOLDT',
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
    iverksattTidspunkt: Nullable<string>;
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
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarord>;
    erKlagenSignert: boolean;
    brevtekst: Brevtekst[];
    avbrutt: Nullable<Avbrutt>;
    kanIverksette: boolean;
    årsak: Nullable<OmgjøringÅrsak>;
    begrunnelse: Nullable<string>;
    rammebehandlingId: Nullable<BehandlingId>;
    ventestatus: Nullable<VentestatusHendelse>;
    hjemler: Nullable<Klagehjemmel[]>;
}

export interface Brevtekst {
    tittel: string;
    tekst: string;
}

export enum KlagefristUnntakSvarord {
    JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN = 'JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN',
    JA_AV_SÆRLIGE_GRUNNER = 'JA_AV_SÆRLIGE_GRUNNER',
    NEI = 'NEI',
}

export interface OpprettKlageRequest {
    journalpostId: string;
    vedtakDetKlagesPå: Nullable<string>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarord>;
    erKlagenSignert: boolean;
}

export interface OppdaterKlageFormkravRequest {
    journalpostId: string;
    vedtakDetKlagesPå: Nullable<string>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarord>;
    erKlagenSignert: boolean;
}

export enum OmgjøringÅrsak {
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_LOVANVENDELSE = 'FEIL_LOVANVENDELSE',
    FEIL_REGELVERKSFORSTAAELSE = 'FEIL_REGELVERKSFORSTAAELSE',
    PROSESSUELL_FEIL = 'PROSESSUELL_FEIL',
    ANNET = 'ANNET',
}

export interface VurderKlageRequest {
    vurderingstype: 'OMGJØR' | 'OPPRETTHOLD';
    årsak: Nullable<OmgjøringÅrsak>;
    begrunnelse: Nullable<string>;
    hjemler: Nullable<Klagehjemmel[]>;
}

export interface ForhåndsvisBrevKlageRequest {
    tekstTilVedtaksbrev: Brevtekst[];
}

export interface LagreBrevtekstKlageRequest {
    tekstTilVedtaksbrev: Brevtekst[];
}

export interface OpprettOmgjøringsbehandlingForKlageRequest {
    type: 'SØKNADSBEHANDLING_INNVILGELSE' | 'REVURDERING_INNVILGELSE' | 'REVURDERING_OMGJØRING';
    søknadId: Nullable<string>;
}

export type VedtattKlagevedtakMedBehandling = { type: 'klagevedtak' } & Klagevedtak & {
        behandling: Klagebehandling;
    };

export enum Klagehjemmel {
    ARBEIDSMARKEDSLOVEN_2 = 'ARBEIDSMARKEDSLOVEN_2',
    ARBEIDSMARKEDSLOVEN_13 = 'ARBEIDSMARKEDSLOVEN_13',
    ARBEIDSMARKEDSLOVEN_13_L1 = 'ARBEIDSMARKEDSLOVEN_13_L1',
    ARBEIDSMARKEDSLOVEN_13_L4 = 'ARBEIDSMARKEDSLOVEN_13_L4',
    ARBEIDSMARKEDSLOVEN_15 = 'ARBEIDSMARKEDSLOVEN_15',
    ARBEIDSMARKEDSLOVEN_17 = 'ARBEIDSMARKEDSLOVEN_17',
    ARBEIDSMARKEDSLOVEN_22 = 'ARBEIDSMARKEDSLOVEN_22',

    FOLKETRYGDLOVEN_22_15 = 'FOLKETRYGDLOVEN_22_15',
    FOLKETRYGDLOVEN_22_17_A = 'FOLKETRYGDLOVEN_22_17_A',

    FORELDELSESLOVEN_10 = 'FORELDELSESLOVEN_10',
    FORELDELSESLOVEN_2_OG_3 = 'FORELDELSESLOVEN_2_OG_3',

    FORVALTNINGSLOVEN_11 = 'FORVALTNINGSLOVEN_11',
    FORVALTNINGSLOVEN_17 = 'FORVALTNINGSLOVEN_17',
    FORVALTNINGSLOVEN_18_OG_19 = 'FORVALTNINGSLOVEN_18_OG_19',
    FORVALTNINGSLOVEN_28 = 'FORVALTNINGSLOVEN_28',
    FORVALTNINGSLOVEN_30 = 'FORVALTNINGSLOVEN_30',
    FORVALTNINGSLOVEN_31 = 'FORVALTNINGSLOVEN_31',
    FORVALTNINGSLOVEN_32 = 'FORVALTNINGSLOVEN_32',
    FORVALTNINGSLOVEN_35 = 'FORVALTNINGSLOVEN_35',
    FORVALTNINGSLOVEN_41 = 'FORVALTNINGSLOVEN_41',
    FORVALTNINGSLOVEN_42 = 'FORVALTNINGSLOVEN_42',

    TILTAKSPENGEFORSKRIFTEN_2 = 'TILTAKSPENGEFORSKRIFTEN_2',
    TILTAKSPENGEFORSKRIFTEN_3 = 'TILTAKSPENGEFORSKRIFTEN_3',
    TILTAKSPENGEFORSKRIFTEN_5 = 'TILTAKSPENGEFORSKRIFTEN_5',
    TILTAKSPENGEFORSKRIFTEN_6 = 'TILTAKSPENGEFORSKRIFTEN_6',
    TILTAKSPENGEFORSKRIFTEN_7 = 'TILTAKSPENGEFORSKRIFTEN_7',
    TILTAKSPENGEFORSKRIFTEN_8 = 'TILTAKSPENGEFORSKRIFTEN_8',
    TILTAKSPENGEFORSKRIFTEN_9 = 'TILTAKSPENGEFORSKRIFTEN_9',
    TILTAKSPENGEFORSKRIFTEN_10 = 'TILTAKSPENGEFORSKRIFTEN_10',
    TILTAKSPENGEFORSKRIFTEN_11 = 'TILTAKSPENGEFORSKRIFTEN_11',
}
