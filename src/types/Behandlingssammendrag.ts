import { Nullable } from '~/types/UtilTypes';

export interface BenkOversiktRequest {
    behandlingstype: Nullable<BehandlingssammendragType[]>;
    status: Nullable<BehandlingssammendragStatus[]>;
    sortering: 'ASC' | 'DESC';
    identer: Nullable<string[]>;
}

export interface BenkOversiktResponse {
    behandlingssammendrag: Behandlingssammendrag[];
    totalAntall: number;
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
}

export enum BehandlingssammendragType {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
}

export enum BehandlingssammendragStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
}
