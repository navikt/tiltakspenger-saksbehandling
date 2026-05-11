import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { SakProps } from '~/lib/sak/SakTyper';
import { erBeslutter, erSaksbehandler, kanBehandle } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';

export const erMeldekortbehandlingUnderAktivBehandling = (m: MeldekortbehandlingProps) =>
    m.status === MeldekortbehandlingStatus.UNDER_BEHANDLING ||
    m.status === MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING ||
    m.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;

export const sorterMeldekortbehandlingerAsc = (
    a: MeldekortbehandlingProps,
    b: MeldekortbehandlingProps,
) => (a.opprettet > b.opprettet ? -1 : 1);

export const oppdaterMeldeperiodeKjedeMedMeldekortbehandling = (
    meldeperiodeKjede: MeldeperiodeKjedeProps,
    oppdatertMeldekortbehandling: MeldekortbehandlingProps,
): MeldeperiodeKjedeProps => ({
    ...meldeperiodeKjede,
    meldekortbehandlinger: meldeperiodeKjede.meldekortbehandlinger.map((meldekortbehandling) =>
        meldekortbehandling.id === oppdatertMeldekortbehandling.id
            ? oppdatertMeldekortbehandling
            : meldekortbehandling,
    ),
});

export const oppdaterSakMedMeldekortbehandling = (
    sak: SakProps,
    oppdatertMeldekortbehandling: MeldekortbehandlingProps,
): SakProps => ({
    ...sak,
    meldeperiodeKjeder: sak.meldeperiodeKjeder.map((meldeperiodeKjede) =>
        meldeperiodeKjede.meldekortbehandlinger.some(
            (meldekortbehandling) => meldekortbehandling.id === oppdatertMeldekortbehandling.id,
        )
            ? oppdaterMeldeperiodeKjedeMedMeldekortbehandling(
                  meldeperiodeKjede,
                  oppdatertMeldekortbehandling,
              )
            : meldeperiodeKjede,
    ),
});

export const kanSaksbehandleForMeldekort = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) =>
    kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) &&
    meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING &&
    !erMeldekortbehandlingSattPaVent(meldekortbehandling);

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const { status, saksbehandler } = meldekort;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === MeldekortbehandlingStatus.UNDER_BESLUTNING &&
        !erMeldekortbehandlingSattPaVent(meldekort)
    );
};

export const eierMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
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

export const skalKunneTaMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
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
    innloggetSaksbehandler: Saksbehandler,
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

export const erMeldekortbehandlingSattPaVent = (meldekortbehandling: MeldekortbehandlingProps) =>
    meldekortbehandling.ventestatus?.at(-1)?.erSattPåVent ?? false;

export const skalKunneGjenopptaMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    return (
        erMeldekortbehandlingSattPaVent(meldekortbehandling) &&
        (skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler) ||
            skalKunneOvertaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler) ||
            eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler))
    );
};

export const skalKunneSetteMeldekortbehandlingPaVent = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING ||
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;
    return (
        erRelevantMenyValgForStatus &&
        !erMeldekortbehandlingSattPaVent(meldekortbehandling) &&
        eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)
    );
};
