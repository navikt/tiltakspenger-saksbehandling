import {
    BehandlingssammendragStatus,
    BehandlingssammendragType,
} from '~/types/Behandlingssammendrag';

export const behandlingstypeTextFormatter: Record<BehandlingssammendragType, string> = {
    [BehandlingssammendragType.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [BehandlingssammendragType.REVURDERING]: 'Revurdering',
    [BehandlingssammendragType.MELDEKORTBEHANDLING]: 'Meldekortbehandling',
    [BehandlingssammendragType.INNSENDT_MELDEKORT]: 'Innsendt meldekort',
    [BehandlingssammendragType.KORRIGERT_MELDEKORT]: 'Korrigert meldekort',
};

export const behandlingsstatusTextFormatter: Record<BehandlingssammendragStatus, string> = {
    [BehandlingssammendragStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [BehandlingssammendragStatus.UNDER_BEHANDLING]: 'Under behandling',
    [BehandlingssammendragStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [BehandlingssammendragStatus.UNDER_BESLUTNING]: 'Under beslutning',
};

export enum BehandlingssammendragKolonner {
    fnr = 'fnr',
    behandlingstype = 'behandlingstype',
    status = 'status',
    startet = 'startet',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    sistEndret = 'sist_endret',
}
