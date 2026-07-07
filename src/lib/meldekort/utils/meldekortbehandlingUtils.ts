import {
    MeldekortbehandlingPropsV2,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { erBeslutter, kanBehandle } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldeperiodeSkjema } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import { MeldeperiodeKjedeId, MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';

export const kanSaksbehandleForMeldekort = (
    meldekortbehandling: MeldekortbehandlingPropsV2,
    innloggetSaksbehandler: Saksbehandler,
): boolean =>
    kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) &&
    meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING &&
    !erMeldekortbehandlingSattPaVent(meldekortbehandling);

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortbehandlingPropsV2,
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

export const erMeldekortbehandlingSattPaVent = (
    meldekortbehandling: MeldekortbehandlingPropsV2,
): boolean => erBehandlingSattPåVent(meldekortbehandling);

/**
 * Med 'under aktiv omgjøring' så mener vi at meldekortbehandlingen er opprettet som en omgjøringsbehandling for en klage - og den ikke er fortsatt er i en tilstand saksbehandler kan fritt redigere på.
 *
 * @param mb - nullable fordi klage ikke alltid har en tilknyttet meldekortbehandling & fordi det blitt litt cleanere kode fra klage-sidene sin side :-)
 */
export const erMeldekortbehandlingUnderAktivOmgjøring = (mb: MeldekortbehandlingPropsV2): boolean =>
    mb.status == MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING ||
    mb.status == MeldekortbehandlingStatus.UNDER_BEHANDLING;

export const erMeldekortbehandlingGodkjent = (mb: MeldekortbehandlingPropsV2): boolean => {
    return (
        mb.status === MeldekortbehandlingStatus.GODKJENT ||
        mb.status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET
    );
};

export const finnAntallUbehandledeMeldekort = (
    kjeder: MeldeperiodekjedeProps[],
    skjema?: MeldeperiodeSkjema[],
): number => {
    const valgteKjedeIder = new Set<MeldeperiodeKjedeId>(skjema?.map((m) => m.kjedeId));

    const tilgjengeligeKjeder = kjeder.filter((kjede) => !valgteKjedeIder.has(kjede.id));

    const ubehandledeKjeder = tilgjengeligeKjeder.filter(
        (kjede) =>
            kjede.brukersMeldekortStatus === BrukersMeldekortKjedeStatus.VENTER_BEHANDLING ||
            kjede.brukersMeldekortStatus ===
                BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING,
    );

    return ubehandledeKjeder.length;
};
