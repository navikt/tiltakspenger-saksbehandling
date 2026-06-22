import {
    MeldekortbehandlingSkjemaState,
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { nonNullishPredicate } from '~/utils/array';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';

export type MeldekortDagValideringsfeil = {
    dato: string;
    feil: string;
};

export const validerMeldekortDagSkjema = (
    dag: MeldekortDagSkjema,
): MeldekortDagValideringsfeil | null => {
    if (dag.status === MeldekortbehandlingDagStatus.IkkeBesvart) {
        return { dato: dag.dato, feil: 'Status må besvares' };
    }

    return null;
};

export type MeldeperiodeSkjemaValideringsfeil = {
    kjedeId: MeldeperiodeKjedeId;
    dager: MeldekortDagValideringsfeil[];
};

export const validerMeldeperiodeSkjema = (
    meldeperiode: MeldeperiodeSkjema,
): MeldeperiodeSkjemaValideringsfeil | null => {
    const dagerFeil = meldeperiode.dager
        .map((dag) => validerMeldekortDagSkjema(dag))
        .filter(nonNullishPredicate);

    if (dagerFeil.length != 0) {
        return {
            kjedeId: meldeperiode.kjedeId,
            dager: dagerFeil,
        };
    }

    return null;
};

export type MeldekortbehandlingSkjemaValideringsfeil = {
    meldeperioder: MeldeperiodeSkjemaValideringsfeil[];
};

export const validerMeldekortbehandlingSkjema = (
    skjema: MeldekortbehandlingSkjemaState,
): MeldekortbehandlingSkjemaValideringsfeil | null => {
    const meldeperioderFeil = skjema.meldeperioder
        .map((meldeperiode) => validerMeldeperiodeSkjema(meldeperiode))
        .filter(nonNullishPredicate);

    if (meldeperioderFeil.length > 0) {
        return { meldeperioder: meldeperioderFeil };
    }

    return null;
};
