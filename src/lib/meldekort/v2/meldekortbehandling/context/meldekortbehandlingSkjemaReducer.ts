import { Reducer } from 'react';
import {
    MeldekortbehandlingSkjemaActions,
    MeldekortbehandlingSkjemaState,
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingPropsV2,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeId, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/typer/Meldeperiode';

export const meldekortbehandlingSkjemaInitialState = (
    meldekortbehandling: MeldekortbehandlingPropsV2,
): MeldekortbehandlingSkjemaState => ({
    meldeperioder: meldekortbehandling.meldeperioder.map<MeldeperiodeSkjema>((meldeperiode) => ({
        kjedeId: meldeperiode.kjedeId as MeldeperiodeKjedeId,
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

            const meldeperiodeIndex = state.meldeperioder.findIndex((mp) => mp.kjedeId === kjedeId);

            if (meldeperiodeIndex === -1) {
                throw Error(`Fant ingen meldeperiode for kjede ${kjedeId}`);
            }

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
                ],
            };
        }

        case 'fjernMeldeperiode': {
            const { index } = action.payload;

            return {
                ...state,
                meldeperioder: state.meldeperioder.toSpliced(index, 1),
            };
        }
    }
};

const meldeperiodeKjedeTilContext = (
    meldeperiodeKjede: MeldeperiodeKjedePropsV2,
): MeldeperiodeSkjema => {
    const dager: MeldekortDagSkjema[] = Object.entries(
        meldeperiodeKjede.meldeperioder.at(-1)!.girRett,
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
