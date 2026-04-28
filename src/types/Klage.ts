import { Avbrutt } from './Avbrutt';
import { Klageinstanshendelse } from './Klageinstanshendelse';
import { BehandlingId } from './Rammebehandling';
import { VedtakId } from './Rammevedtak';
import { SakId } from './Sak';
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
    VEDTATT = 'VEDTATT',
    OPPRETTHOLDT = 'OPPRETTHOLDT',
    OVERSENDT = 'OVERSENDT',
    FERDIGSTILT = 'FERDIGSTILT',
    MOTTATT_FRA_KLAGEINSTANS = 'MOTTATT_FRA_KLAGEINSTANS',
    OMGJØRING_ETTER_KLAGEINSTANS = 'OMGJØRING_ETTER_KLAGEINSTANS',
}

export interface Klagebehandling {
    id: KlageId;
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    opprettet: string;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    saksbehandler: Nullable<string>;
    klagensJournalpostId: string;
    klagensJournalpostOpprettet: string;
    status: KlagebehandlingStatus;
    resultat: Nullable<KlagebehandlingsresultatDTO>;
    avbrutt: Nullable<Avbrutt>;
    kanIverksetteVedtak: Nullable<boolean>;
    kanIverksetteOpprettholdelse: boolean;
    ventestatus: VentestatusHendelse[];
    formkrav: KlageFormkrav;
    tilknyttedeRammebehandlingIder: BehandlingId[];
    åpenRammebehandlingId: Nullable<BehandlingId>;
}

export interface KlageFormkrav {
    vedtakDetKlagesPå: Nullable<VedtakId>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarord>;
    erKlagenSignert: boolean;
    innsendingsdato: string;
    innsendingskilde: KlageInnsendingskilde;
}

export type KlagebehandlingsresultatDTO =
    | KlagebehandlingsresultatAvvist
    | KlagebehandlingsresultatOmgjør
    | KlagebehandlingsresultatOpprettholdt;

export interface KlagebehandlingsresultatAvvist {
    type: KlagebehandlingResultat.AVVIST;
    brevtekst: Brevtekst[];
    begrunnelseFerdigstilling: Nullable<string>;
}

export interface KlagebehandlingsresultatOmgjør {
    type: KlagebehandlingResultat.OMGJØR;
    årsak: OmgjøringÅrsak;
    begrunnelse: string;
    begrunnelseFerdigstilling: Nullable<string>;
    ferdigstiltTidspunkt: Nullable<string>;
}

export interface KlagebehandlingsresultatOpprettholdt {
    type: KlagebehandlingResultat.OPPRETTHOLDT;
    brevtekst: Brevtekst[];
    hjemler: Klagehjemmel[];
    iverksattOpprettholdelseTidspunkt: Nullable<string>;
    journalføringstidspunktInnstillingsbrev: Nullable<string>;
    distribusjonstidspunktInnstillingsbrev: Nullable<string>;
    oversendtKlageinstansenTidspunkt: Nullable<string>;
    klageinstanshendelser: Klageinstanshendelse[];
    ferdigstiltTidspunkt: Nullable<string>;
    journalpostIdInnstillingsbrev: Nullable<string>;
    dokumentInfoIder: Nullable<string[]>;
    begrunnelseFerdigstilling: Nullable<string>;
}

export interface Brevtekst {
    tittel: string;
    tekst: string;
}

export enum KlageInnsendingskilde {
    DIGITAL = 'DIGITAL',
    PAPIR_SKJEMA = 'PAPIR_SKJEMA',
    PAPIR_FRIHAND = 'PAPIR_FRIHAND',
    MODIA = 'MODIA',
    ANNET = 'ANNET',
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
    innsendingsdato: string;
    innsendingskilde: KlageInnsendingskilde;
}

export interface OppdaterKlageFormkravRequest {
    journalpostId: string;
    vedtakDetKlagesPå: Nullable<string>;
    erKlagerPartISaken: boolean;
    klagesDetPåKonkreteElementerIVedtaket: boolean;
    erKlagefristenOverholdt: boolean;
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarord>;
    erKlagenSignert: boolean;
    innsendingsdato: string;
    innsendingskilde: KlageInnsendingskilde;
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
    vedtakIdSomSkalOmgjøres: Nullable<string>;
}

export type KlagevedtakMedBehandling = { type: 'klagevedtak' } & Klagevedtak & {
        behandling: Klagebehandling;
    };

export enum Klagehjemmel {
    ARBEIDSMARKEDSLOVEN_2 = 'ARBEIDSMARKEDSLOVEN_2',
    ARBEIDSMARKEDSLOVEN_13 = 'ARBEIDSMARKEDSLOVEN_13',
    ARBEIDSMARKEDSLOVEN_13_LØNN = 'ARBEIDSMARKEDSLOVEN_13_LØNN',
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
