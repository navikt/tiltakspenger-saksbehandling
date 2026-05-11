import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { Saksbehandler, SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';

export const erSaksbehandler = (saksbehandler: Saksbehandler) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.SAKSBEHANDLER);

export const erBeslutter = (saksbehandler: Saksbehandler) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.BESLUTTER);

export const kanBeslutteForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler, beslutter } = behandling;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent === beslutter &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === Rammebehandlingsstatus.UNDER_BESLUTNING
    );
};

export const kanBehandle = (
    innloggetSaksbehandler: Saksbehandler,
    saksbehandlerForBehandling?: string | null,
) =>
    erSaksbehandler(innloggetSaksbehandler) &&
    innloggetSaksbehandler.navIdent === saksbehandlerForBehandling;

export const kanSaksbehandleForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return (
        kanBehandle(innloggetSaksbehandler, behandling.saksbehandler) &&
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING
    );
};

export const hentRolleForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutteForBehandling(behandling, innloggetSaksbehandler)
          ? SaksbehandlerRolle.BESLUTTER
          : null;
};

export const eierBehandling = (
    behandling: ÅpenRammebehandlingForOversikt | Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { status, saksbehandler, beslutter } = behandling;
    switch (status) {
        case Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case Rammebehandlingsstatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent === saksbehandler;
        case Rammebehandlingsstatus.UNDER_BESLUTNING:
            return innloggetSaksbehandler.navIdent === beslutter;
        default:
            return false;
    }
};

export const skalKunneTaBehandling = (
    behandling: ÅpenRammebehandlingForOversikt | Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = behandling;

    switch (status) {
        case Rammebehandlingsstatus.KLAR_TIL_BESLUTNING:
            return (
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        case Rammebehandlingsstatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler(innloggetSaksbehandler);
        default:
            return false;
    }
};

export const skalKunneOvertaBehandling = (
    behandling: ÅpenRammebehandlingForOversikt | Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler, beslutter } = behandling;

    switch (status) {
        case Rammebehandlingsstatus.UNDER_BESLUTNING:
            return (
                beslutter &&
                erBeslutter(innloggetSaksbehandler) &&
                !eierBehandling(behandling, innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent !== saksbehandler
            );
        case Rammebehandlingsstatus.UNDER_BEHANDLING:
        case Rammebehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
            return (
                saksbehandler &&
                erSaksbehandler(innloggetSaksbehandler) &&
                !eierBehandling(behandling, innloggetSaksbehandler)
            );
        default:
            return false;
    }
};

export const skalKunneGjenopptaBehandling = (
    behandling: Rammebehandling | ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return (
        erSattPaVent(behandling) &&
        (skalKunneTaBehandling(behandling, innloggetSaksbehandler) ||
            skalKunneOvertaBehandling(behandling, innloggetSaksbehandler) ||
            eierBehandling(behandling, innloggetSaksbehandler))
    );
};

export const skalKunneSetteBehandlingPaVent = (
    behandling: Rammebehandling | ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status == Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;
    return (
        erRelevantMenyValgForStatus &&
        !erSattPaVent(behandling) &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

export const erSattPaVent = (behandling: Rammebehandling | ÅpenRammebehandlingForOversikt) => {
    if ('ventestatus' in behandling) {
        return behandling.ventestatus && behandling.ventestatus.at(-1)?.erSattPåVent;
    } else {
        return behandling.erSattPåVent;
    }
};
