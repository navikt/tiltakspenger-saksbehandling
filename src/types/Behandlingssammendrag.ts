import { Nullable } from '~/types/UtilTypes';

export interface BenkOversiktRequest {
    benktype: Nullable<BehandlingssammendragBenktype[]>;
    behandlingstype: Nullable<BehandlingssammendragType[]>;
    status: Nullable<BehandlingssammendragStatus[]>;
    sortering: string;
    identer: Nullable<string[]>;
}

export interface BenkOversiktResponse {
    behandlingssammendrag: Behandlingssammendrag[];
    totalAntall: number;
    antallFiltrertPgaTilgang: number;
}

export interface Behandlingssammendrag {
    sakId: string;
    fnr: string;
    saksnummer: string;
    startet: string;
    kravtidspunkt?: string;
    behandlingstype: BehandlingssammendragType;
    status: Nullable<BehandlingssammendragStatus>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    sistEndret?: string;
    erSattPåVent: boolean;
}

export enum BehandlingssammendragType {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    KLAGEBEHANDLING = 'KLAGEBEHANDLING',
}

export enum BehandlingssammendragStatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
}

export enum BehandlingssammendragBenktype {
    KLAR = 'KLAR',
    VENTER = 'VENTER',
}
