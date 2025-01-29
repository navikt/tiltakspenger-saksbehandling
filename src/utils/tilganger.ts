import { BehandlingStatus } from '../types/BehandlingTypes';
import { MeldekortBehandlingStatus } from '../types/MeldekortBehandling';
import { erBeslutter, erSaksbehandler, Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
    status: string,
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForBehandling: string,
    beslutterForBehandling: string,
) => {
    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent === beslutterForBehandling &&
        innloggetSaksbehandler.navIdent !== saksbehandlerForBehandling &&
        (status === BehandlingStatus.UNDER_BESLUTNING ||
            status === MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING)
    );
};

const kanBehandle = (innloggetSaksbehandler: Saksbehandler, saksbehandlerForBehandling: string) =>
    erSaksbehandler(innloggetSaksbehandler) &&
    innloggetSaksbehandler.navIdent === saksbehandlerForBehandling;

export const kanSaksbehandleForBehandling = (
    status: BehandlingStatus,
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForBehandling: string,
) => {
    return (
        kanBehandle(innloggetSaksbehandler, saksbehandlerForBehandling) &&
        status === BehandlingStatus.UNDER_BEHANDLING
    );
};

export const kanSaksbehandleMeldekort = (
    status: MeldekortBehandlingStatus,
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForMeldekort: string,
) =>
    kanBehandle(innloggetSaksbehandler, saksbehandlerForMeldekort) &&
    status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;

export const eierBehandling = (
    status: string,
    innloggetSaksbehandler,
    saksbehandlerForBehandling: string,
    beslutterForBehandling: string,
) => {
    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent == saksbehandlerForBehandling;
        case BehandlingStatus.UNDER_BESLUTNING:
            return innloggetSaksbehandler.navIdent == beslutterForBehandling;
    }
};

export const skalKunneTaBehandling = (
    status: string,
    innloggetSaksbehandler,
    saksbehandlerForBehandling?: string,
) => {
    switch (status) {
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
            return (
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandlerForBehandling
            );
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler(innloggetSaksbehandler);
        default:
            return false;
    }
};
