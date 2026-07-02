import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { erBeslutter, erSaksbehandler, kanBehandle } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';

export const erMeldekortbehandlingUnderAktivBehandling = (m: MeldekortbehandlingProps): boolean =>
    m.status === MeldekortbehandlingStatus.UNDER_BEHANDLING ||
    m.status === MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING ||
    m.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;

export const sorterMeldekortbehandlingerDesc = (
    a: MeldekortbehandlingProps,
    b: MeldekortbehandlingProps,
) => (a.opprettet > b.opprettet ? -1 : 1);

export const kanSaksbehandleForMeldekort = (
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean =>
    kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) &&
    meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING &&
    !erMeldekortbehandlingSattPaVent(meldekortbehandling);

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { status, saksbehandler } = meldekort;

    return (
        erBeslutter(innloggetSaksbehandler) &&
        innloggetSaksbehandler.navIdent !== saksbehandler &&
        status === MeldekortbehandlingStatus.UNDER_BESLUTNING &&
        !erMeldekortbehandlingSattPaVent(meldekort)
    );
};

export const eierMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
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
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
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
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const { status, saksbehandler, beslutter } = meldekortbehandling;

    switch (status) {
        case MeldekortbehandlingStatus.UNDER_BESLUTNING:
            return (
                !!beslutter &&
                erBeslutter(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        case MeldekortbehandlingStatus.UNDER_BEHANDLING:
            return (
                !!saksbehandler &&
                erSaksbehandler(innloggetSaksbehandler) &&
                innloggetSaksbehandler.navIdent != saksbehandler
            );
        default:
            return false;
    }
};

export const erMeldekortbehandlingSattPaVent = (
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
): boolean => erBehandlingSattPåVent(meldekortbehandling);

export const skalKunneGjenopptaMeldekortbehandling = (
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    return (
        erMeldekortbehandlingSattPaVent(meldekortbehandling) &&
        (skalKunneTaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler) ||
            skalKunneOvertaMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler) ||
            eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler))
    );
};

export const skalKunneSetteMeldekortbehandlingPaVent = (
    meldekortbehandling: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean => {
    const erRelevantMenyValgForStatus =
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING ||
        meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BESLUTNING;
    return (
        erRelevantMenyValgForStatus &&
        !erMeldekortbehandlingSattPaVent(meldekortbehandling) &&
        eierMeldekortbehandling(meldekortbehandling, innloggetSaksbehandler)
    );
};

/**
 * Med 'under aktiv omgjøring' så mener vi at meldekortbehandlingen er opprettet som en omgjøringsbehandling for en klage - og den ikke er fortsatt er i en tilstand saksbehandler kan fritt redigere på.
 *
 * @param mb - nullable fordi klage ikke alltid har en tilknyttet meldekortbehandling & fordi det blitt litt cleanere kode fra klage-sidene sin side :-)
 */
export const erMeldekortbehandlingUnderAktivOmgjøring = (
    mb: MeldekortbehandlingProps | MeldekortbehandlingPropsV2,
): boolean =>
    mb.status == MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING ||
    mb.status == MeldekortbehandlingStatus.UNDER_BEHANDLING;

export const erMeldekortbehandlingGodkjent = (mb: MeldekortbehandlingPropsV2): boolean => {
    return (
        mb.status === MeldekortbehandlingStatus.GODKJENT ||
        mb.status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET
    );
};
