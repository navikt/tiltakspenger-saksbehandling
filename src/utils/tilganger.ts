import { BehandlingStatus } from '../types/BehandlingTypes';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../types/meldekort/MeldekortBehandling';
import { erBeslutter, erSaksbehandler, Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
    status: BehandlingStatus | MeldekortBehandlingStatus,
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
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) =>
    kanBehandle(innloggetSaksbehandler, meldekortBehandling.saksbehandler) &&
    meldekortBehandling.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING;

export const eierBehandling = (
    status: BehandlingStatus,
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForBehandling: string,
    beslutterForBehandling: string,
): boolean => {
    switch (status) {
        case BehandlingStatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent == saksbehandlerForBehandling;
        case BehandlingStatus.UNDER_BESLUTNING:
            return innloggetSaksbehandler.navIdent == beslutterForBehandling;
        default:
            return false;
    }
};

export const skalKunneTaBehandling = (
    status: BehandlingStatus,
    innloggetSaksbehandler: Saksbehandler,
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
