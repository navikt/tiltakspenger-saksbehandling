import { Reducer } from 'react';
import { Avslagsgrunn, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import {
    getTiltaksdeltagelseActionHandlers,
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import {
    BarnetilleggActions,
    BarnetilleggState,
    getBarnetilleggActionHandlers,
} from '~/components/behandling/felles/state/BarnetilleggState';
import { ReducerActionHandlers } from '~/types/Context';
import {
    getInnvilgelseActionHandlers,
    InnvilgelseActions,
    InnvilgelseState,
} from '~/components/behandling/felles/state/InnvilgelseState';
import {
    AntallDagerForMeldeperiodeAction,
    AntallDagerForMeldeperiodeState,
    getAntallDagerForMeldeperiodeActionHandler,
} from '../../felles/state/AntallDagerState';

type BaseActions =
    | {
          type: 'setResultat';
          payload: { resultat: SøknadsbehandlingResultat | null };
      }
    | {
          type: 'oppdaterAvslagsgrunn';
          payload: { avslagsgrunn: Avslagsgrunn };
      };

type BaseState = {
    resultat: Nullable<SøknadsbehandlingResultat>;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

const baseActionHandlers = {
    setResultat: (state, payload: { resultat: SøknadsbehandlingResultat | null }) => {
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
} as const satisfies ReducerActionHandlers<SøknadsbehandlingSkjemaState, BaseActions>;

export type SøknadsbehandlingSkjemaActions =
    | BaseActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | InnvilgelseActions
    | AntallDagerForMeldeperiodeAction;

export type SøknadsbehandlingSkjemaState = BaseState &
    BarnetilleggState &
    TiltaksdeltagelseState &
    InnvilgelseState &
    AntallDagerForMeldeperiodeState;

const actionHandlers = {
    ...getTiltaksdeltagelseActionHandlers<SøknadsbehandlingSkjemaState>(),
    ...getBarnetilleggActionHandlers<SøknadsbehandlingSkjemaState>(),
    ...getInnvilgelseActionHandlers<SøknadsbehandlingSkjemaState>(),
    ...getAntallDagerForMeldeperiodeActionHandler<SøknadsbehandlingSkjemaState>(),
    ...baseActionHandlers,
} as const satisfies ReducerActionHandlers<
    SøknadsbehandlingSkjemaState,
    SøknadsbehandlingSkjemaActions
>;

export const SøknadsbehandlingReducer: Reducer<
    SøknadsbehandlingSkjemaState,
    SøknadsbehandlingSkjemaActions
> = (state, action): SøknadsbehandlingSkjemaState => {
    const { type, payload } = action;

    const handler = actionHandlers[type];
    if (handler) {
        // :sadpanda:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handler(state, payload as any);
    }

    console.error(`Ugyldig action for søknadsbehandling: "${type}"`);
    return state;
};
