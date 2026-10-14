import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/ReducerAction';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useBehandlingSkjemaDispatch } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';

/**
 * Skjemafelter som gjelder for alle behandlingstyper og resultater.
 * Disse beholdes når saksbehandler endrer resultatet på behandlingen.
 */
export type BehandlingSkjemaFellesState = {
    skalJournalføreNotat: boolean;
    erPrioritert: boolean;
};

type Actions =
    | {
          type: 'setSkalJournalføreNotat';
          payload: { skalJournalføreNotat: boolean };
      }
    | {
          type: 'setErPrioritert';
          payload: { erPrioritert: boolean };
      };

export type BehandlingSkjemaFellesActions = ReducerSuperAction<
    Actions,
    BehandlingSkjemaType.Felles
>;

export const behandlingSkjemaFellesInitialState = (
    behandling: Rammebehandling,
): BehandlingSkjemaFellesState => ({
    skalJournalføreNotat: behandling.skalJournalføreNotat,
    erPrioritert: behandling.prioritering !== null,
});

export const hentBehandlingSkjemaFellesState = ({
    skalJournalføreNotat,
    erPrioritert,
}: BehandlingSkjemaFellesState): BehandlingSkjemaFellesState => ({
    skalJournalføreNotat,
    erPrioritert,
});

export const behandlingSkjemaFellesReducer: Reducer<
    BehandlingSkjemaFellesState,
    BehandlingSkjemaFellesActions
> = (state, action): BehandlingSkjemaFellesState => {
    const { type, payload } = action;

    switch (type) {
        case 'setSkalJournalføreNotat':
            return {
                ...state,
                skalJournalføreNotat: payload.skalJournalføreNotat,
            };

        case 'setErPrioritert':
            return {
                ...state,
                erPrioritert: payload.erPrioritert,
            };
    }

    throw Error(`Ugyldig action for felles behandlingsskjema: ${type satisfies never}`);
};

export const useBehandlingSkjemaFellesDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: Actions) => dispatch({ ...action, superType: BehandlingSkjemaType.Felles });
};
