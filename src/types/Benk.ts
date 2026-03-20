import { Nullable } from '~/types/UtilTypes';
import { RammebehandlingResultat } from '~/types/Rammebehandling';

export interface BenkOversiktRequest {
    benktype: Nullable<BehandlingssammendragBenktype[]>;
    behandlingstype: Nullable<BenkBehandlingstype[]>;
    status: Nullable<BenkBehandlingsstatus[]>;
    sortering: BenkSortering;
    identer: Nullable<string[]>;
}

export interface BenkOversiktResponse {
    behandlingssammendrag: BenkBehandling[];
    totalAntall: number;
    antallFiltrertPgaTilgang: number;
}

export interface BenkBehandling {
    sakId: string;
    fnr: string;
    saksnummer: string;
    startet: string;
    kravtidspunkt?: string;
    behandlingstype: BenkBehandlingstype;
    status: BenkBehandlingsstatus;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    sistEndret?: string;
    erSattPåVent: boolean;
    sattPåVentBegrunnelse: Nullable<string>;
    sattPåVentFrist: Nullable<string>;
    resultat: Nullable<RammebehandlingResultat>;
    erUnderkjent: boolean;
}

export enum BenkBehandlingstype {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    KLAGEBEHANDLING = 'KLAGEBEHANDLING',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export enum BenkBehandlingsstatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    KLAR_TIL_FERDIGSTILLING = 'KLAR_TIL_FERDIGSTILLING',
}

export enum BehandlingssammendragBenktype {
    KLAR = 'KLAR',
    VENTER = 'VENTER',
}

export enum BenkKolonne {
    fnr = 'fnr',
    behandlingstype = 'behandlingstype',
    status = 'status',
    ventestatus = 'frist',
    startet = 'startet',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    sistEndret = 'sist_endret',
}

export type BenkSorteringRetning = 'ASC' | 'DESC';

export type BenkSortering =
    | `${BenkKolonne},${BenkSorteringRetning}`
    | BenkKolonne
    | BenkSorteringRetning;
