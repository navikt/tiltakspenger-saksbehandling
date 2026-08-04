import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { erBeslutter, kanBehandle } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldeperiodeSkjema } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import { MeldeperiodeKjedeId, MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { formaterMeldeperiode, formaterPeriode, ukenummerFraPeriode } from '~/utils/date';

export const kanBehandleMeldeperiodekjede = ({
    kanIkkeBehandlesGrunn,
}: MeldeperiodekjedeProps): boolean => kanIkkeBehandlesGrunn === null;

export const kanSaksbehandleForMeldekort = (
    meldekortbehandling: MeldekortbehandlingProps,
    innloggetSaksbehandler: Saksbehandler,
): boolean =>
    kanBehandle(innloggetSaksbehandler, meldekortbehandling.saksbehandler) &&
    meldekortbehandling.status === MeldekortbehandlingStatus.UNDER_BEHANDLING &&
    !erMeldekortbehandlingSattPaVent(meldekortbehandling);

export const kanBeslutteForMeldekort = (
    meldekort: MeldekortbehandlingProps,
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
    meldekortbehandling: MeldekortbehandlingProps,
): boolean => erBehandlingSattPåVent(meldekortbehandling);

/**
 * Med 'under aktiv omgjøring' så mener vi at meldekortbehandlingen er opprettet som en omgjøringsbehandling for en klage - og den ikke er fortsatt er i en tilstand saksbehandler kan fritt redigere på.
 */
export const erMeldekortbehandlingUnderAktivOmgjøring = (mb: MeldekortbehandlingProps): boolean =>
    mb.status == MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING ||
    mb.status == MeldekortbehandlingStatus.UNDER_BEHANDLING;

export const erMeldekortbehandlingGodkjent = (mb: MeldekortbehandlingProps): boolean => {
    return (
        mb.status === MeldekortbehandlingStatus.GODKJENT ||
        mb.status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET
    );
};

export const finnUbehandledeMeldekort = (
    kjeder: MeldeperiodekjedeProps[],
    skjema?: MeldeperiodeSkjema[],
): MeldeperiodekjedeProps[] => {
    const valgteKjedeIder = new Set<MeldeperiodeKjedeId>(skjema?.map((m) => m.kjedeId));

    const tilgjengeligeKjeder = kjeder.filter((kjede) => !valgteKjedeIder.has(kjede.id));

    return tilgjengeligeKjeder.filter(
        (kjede) =>
            kjede.brukersMeldekortStatus === BrukersMeldekortKjedeStatus.VENTER_BEHANDLING ||
            kjede.brukersMeldekortStatus ===
                BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING,
    );
};

export const formaterMeldeperioder = (meldekortbehandling: MeldekortbehandlingProps) => {
    const { meldeperioder, periode } = meldekortbehandling;
    const antallPerioder = meldeperioder.length;

    return antallPerioder > 1
        ? `${formaterPeriode(periode)} (${antallPerioder} meldeperioder, uke ${ukenummerFraPeriode(periode)})`
        : formaterMeldeperiode(periode);
};
