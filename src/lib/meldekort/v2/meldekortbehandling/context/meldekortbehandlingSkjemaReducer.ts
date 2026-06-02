import { Reducer } from 'react';
import {
    MeldekortbehandlingSkjemaActions,
    MeldekortbehandlingSkjemaState,
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';

import { MeldekortbehandlingPropsV2, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';

export const meldekortbehandlingSkjemaInitialState = (
    meldekortbehandling: MeldekortbehandlingPropsV2,
): MeldekortbehandlingSkjemaState => ({
    meldeperioder: meldekortbehandling.meldeperioder.map<MeldeperiodeSkjema>((meldeperiode) => ({
        kjedeId: meldeperiode.kjedeId,
        dager: meldeperiode.dager.map((dag) => ({
            dato: dag.dato,
            status: dag.status,
        })),
    })),
    skalSendeVedtaksbrev: meldekortbehandling.skalSendeVedtaksbrev,
});

export const meldekortbehandlingSkjemaReducer: Reducer<
    MeldekortbehandlingSkjemaState,
    MeldekortbehandlingSkjemaActions
> = (state, action) => {
    switch (action.type) {
        case 'oppdaterDagStatus': {
            const { kjedeId, dagIndex, status } = action.payload;

            const meldeperiodeIndex = finnMeldeperiodeIndex(state.meldeperioder, kjedeId);

            const meldeperiode = state.meldeperioder.at(meldeperiodeIndex)!;
            const dag = meldeperiode.dager.at(dagIndex)!;

            return {
                ...state,
                meldeperioder: state.meldeperioder.with(meldeperiodeIndex, {
                    ...meldeperiode,
                    dager: meldeperiode.dager.with(dagIndex, {
                        ...dag,
                        status,
                    }),
                }),
            };
        }

        case 'setDager': {
            const { kjedeId } = action.payload;

            const meldeperiodeIndex = finnMeldeperiodeIndex(state.meldeperioder, kjedeId);

            return {
                ...state,
                meldeperioder: state.meldeperioder.with(meldeperiodeIndex, action.payload),
            };
        }

        case 'setSkalSendeVedtaksbrev': {
            return { ...state, skalSendeVedtaksbrev: action.payload.skalSendeVedtaksbrev };
        }

        case 'leggTilMeldeperiode': {
            const { meldeperiodeKjede } = action.payload;

            const harMeldeperiodekjeden = state.meldeperioder.some(
                (meldeperiode) => meldeperiode.kjedeId === meldeperiodeKjede.id,
            );

            if (harMeldeperiodekjeden) {
                throw new Error(
                    `Meldeperiodekjeden ${meldeperiodeKjede.id} finnes allerede i behandlingen`,
                );
            }

            return {
                ...state,
                meldeperioder: [
                    ...state.meldeperioder,
                    meldeperiodeKjedeTilContext(meldeperiodeKjede),
                ].toSorted((a, b) => (a.kjedeId > b.kjedeId ? 1 : -1)),
            };
        }

        case 'fjernMeldeperiode': {
            const { kjedeId } = action.payload;

            const meldeperiodeIndex = finnMeldeperiodeIndex(state.meldeperioder, kjedeId);

            return {
                ...state,
                meldeperioder: state.meldeperioder.toSpliced(meldeperiodeIndex, 1),
            };
        }
    }
};

const finnMeldeperiodeIndex = (
    meldeperioder: MeldeperiodeSkjema[],
    kjedeId: MeldeperiodeKjedeId,
): number => {
    const meldeperiodeIndex = meldeperioder.findIndex((mp) => mp.kjedeId === kjedeId);

    if (meldeperiodeIndex === -1) {
        throw Error(`Fant ingen meldeperiode for kjede ${kjedeId}`);
    }

    return meldeperiodeIndex;
};

const meldeperiodeKjedeTilContext = (
    meldeperiodeKjede: MeldeperiodeKjedePropsV2,
): MeldeperiodeSkjema => {
    const dager: MeldekortDagSkjema[] = Object.entries(
        meldeperiodeKjede.sisteMeldeperiode.girRett,
    ).map(([dato, girRett]) => {
        return {
            dato,
            status: girRett
                ? MeldekortbehandlingDagStatus.IkkeBesvart
                : MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger,
        };
    });

    return {
        kjedeId: meldeperiodeKjede.id,
        dager,
    };
};
