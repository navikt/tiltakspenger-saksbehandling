import { Reducer } from 'react';
import {
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import {
    BarnetilleggActions,
    BarnetilleggState,
} from '~/components/behandling/felles/state/BarnetilleggState';
import { InnvilgelseActions } from '~/components/behandling/felles/state/InnvilgelseState';
import { AntallDagerForMeldeperiodeState } from '~/components/behandling/felles/state/AntallDagerState';
import { Nullable } from '~/types/UtilTypes';
import { Avslagsgrunn, BehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingsperiodeState } from '~/components/behandling/context/BehandlingsperiodeContext';
import { AntallDagerPerMeldeperiodeActions } from '~/components/behandling/context/slices/AntallDagerPerMeldeperiodeContext';
import { ReducerActionHandlers } from '~/types/Context';

export type BehandlingSkjemaState = {
    resultat: Nullable<BehandlingResultat>;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
} & BehandlingsperiodeState &
    TiltaksdeltagelseState &
    BarnetilleggState &
    AntallDagerForMeldeperiodeState;

type BaseActions =
    | {
          type: 'setResultat';
          payload: { resultat: BehandlingResultat | null };
      }
    | {
          type: 'oppdaterAvslagsgrunn';
          payload: { avslagsgrunn: Avslagsgrunn };
      };

const baseActionHandlers = {
    setResultat: (state, payload: { resultat: BehandlingResultat | null }) => {
        return { ...state, resultat: payload.resultat };
    },

    oppdaterAvslagsgrunn: (state, payload: { avslagsgrunn: Avslagsgrunn }) => {
        if (state.avslagsgrunner === null) {
            return {
                ...state,
                avslagsgrunner: [payload.avslagsgrunn],
            };
        }

        const eksistererAllerede = state.avslagsgrunner.includes(payload.avslagsgrunn);

        if (eksistererAllerede) {
            const newArr = state.avslagsgrunner.filter((grunn) => grunn !== payload.avslagsgrunn);

            if (newArr.length === 0) {
                return { ...state, avslagsgrunner: null };
            } else {
                return { ...state, avslagsgrunner: newArr };
            }
        } else {
            return {
                ...state,
                avslagsgrunner: [...state.avslagsgrunner, payload.avslagsgrunn],
            };
        }
    },
} as const satisfies ReducerActionHandlers<BehandlingSkjemaState, BaseActions>;

export type BehandlingSkjemaActions =
    | BaseActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | InnvilgelseActions
    | AntallDagerPerMeldeperiodeActions;

export const BehandlingSkjemaReducer: Reducer<BehandlingSkjemaState, BehandlingSkjemaActions> = (
    state,
    action,
): BehandlingSkjemaState => {
    const { type, payload } = action;

    const handler = baseActionHandlers[type];
    if (handler) {
        return handler(state, payload);
    }

    console.error(`Ugyldig action for søknadsbehandling: "${type}"`);
    return state;
};
