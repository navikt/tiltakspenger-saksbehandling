import { Rammebehandling, Rammebehandlingsstatus } from '~/types/Rammebehandling';
import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '~/types/meldekort/MeldekortBehandling';
import { Saksbehandler, SaksbehandlerRolle } from '~/types/Saksbehandler';

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

export const erBehandlerEllerBeslutterAvBehandling = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { saksbehandler, beslutter } = behandling;

    return (
        innloggetSaksbehandler.navIdent === saksbehandler ||
        innloggetSaksbehandler.navIdent === beslutter
    );
};

export const kanSaksbehandleForMeldekort = (
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) =>
    kanBehandle(innloggetSaksbehandler, meldekortBehandling.saksbehandler) &&
    meldekortBehandling.status === MeldekortBehandlingStatus.UNDER_BEHANDLING;

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = meldekort;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === MeldekortBehandlingStatus.UNDER_BESLUTNING
    );
};

export const eierMeldekortBehandling = (
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { status, saksbehandler, beslutter } = meldekortBehandling;

    switch (status) {
        case MeldekortBehandlingStatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent === saksbehandler;
        case MeldekortBehandlingStatus.UNDER_BESLUTNING:
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

export const skalKunneTaMeldekortBehandling = (
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = meldekortBehandling;

    switch (status) {
        case MeldekortBehandlingStatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler(innloggetSaksbehandler);
        case MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING:
            return (
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        default:
            return false;
    }
};

export const skalKunneOvertaMeldekortBehandling = (
    meldekortBehandling: MeldekortBehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler, beslutter } = meldekortBehandling;

    switch (status) {
        case MeldekortBehandlingStatus.UNDER_BESLUTNING:
            return (
                beslutter &&
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        case MeldekortBehandlingStatus.UNDER_BEHANDLING:
            return (
                saksbehandler &&
                erSaksbehandler(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
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
        return behandling.ventestatus && behandling.ventestatus.erSattPåVent;
    } else {
        return behandling.erSattPåVent;
    }
};
