import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SaksbehandlerTyper, SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';

export const erSaksbehandler = (saksbehandler: SaksbehandlerTyper) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.SAKSBEHANDLER);

export const erBeslutter = (saksbehandler: SaksbehandlerTyper) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.BESLUTTER);

export const kanBeslutteForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: SaksbehandlerTyper,
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
    innloggetSaksbehandler: SaksbehandlerTyper,
    saksbehandlerForBehandling?: string | null,
) =>
    erSaksbehandler(innloggetSaksbehandler) &&
    innloggetSaksbehandler.navIdent === saksbehandlerForBehandling;

export const kanSaksbehandleForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    return (
        kanBehandle(innloggetSaksbehandler, behandling.saksbehandler) &&
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING
    );
};

export const hentRolleForBehandling = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    return kanSaksbehandleForBehandling(behandling, innloggetSaksbehandler)
        ? SaksbehandlerRolle.SAKSBEHANDLER
        : kanBeslutteForBehandling(behandling, innloggetSaksbehandler)
          ? SaksbehandlerRolle.BESLUTTER
          : null;
};

export const eierBehandling = (
    behandling: ÅpenRammebehandlingForOversikt | Rammebehandling,
    innloggetSaksbehandler: SaksbehandlerTyper,
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

export const kanSaksbehandleForMeldekort = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: SaksbehandlerTyper,
) =>
    kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) &&
    meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING;

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortbehandlingProps,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    const { status, saksbehandler } = meldekort;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === MeldekortbehandlingStatus.UNDER_BESLUTNING
    );
};

export const eierMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: SaksbehandlerTyper,
): boolean => {
    const { status, saksbehandler, beslutter } = meldekortbehandling;

    switch (status) {
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
            return innloggetSaksbehandler.navIdent === saksbehandler;
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return innloggetSaksbehandler.navIdent === beslutter;
        default:
            return false;
    }
};

export const skalKunneTaBehandling = (
    behandling: ÅpenRammebehandlingForOversikt | Rammebehandling,
    innloggetSaksbehandler: SaksbehandlerTyper,
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
    innloggetSaksbehandler: SaksbehandlerTyper,
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

export const skalKunneTaMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    const { status, saksbehandler } = meldekortbehandling;

    switch (status) {
        case MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING:
            return erSaksbehandler(innloggetSaksbehandler);
        case MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING:
            return (
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        default:
            return false;
    }
};

export const skalKunneOvertaMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    const { status, saksbehandler, beslutter } = meldekortbehandling;

    switch (status) {
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return (
                beslutter &&
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
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
    innloggetSaksbehandler: SaksbehandlerTyper,
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
    innloggetSaksbehandler: SaksbehandlerTyper,
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
