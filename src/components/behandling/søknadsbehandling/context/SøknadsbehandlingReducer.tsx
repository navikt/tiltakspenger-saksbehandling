import { Reducer } from 'react';
import { Periode } from '~/types/Periode';
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

type BaseActions =
    | {
          type: 'setResultat';
          payload: { resultat: SøknadsbehandlingResultat };
      }
    | {
          type: 'oppdaterDagerPerMeldeperiode';
          payload: { antallDagerPerMeldeperiode: number };
      }
    | {
          type: 'oppdaterAvslagsgrunn';
          payload: { avslagsgrunn: Avslagsgrunn };
      }
    | {
          type: 'oppdaterBehandlingsperiode';
          payload: { periode: Partial<Periode> };
      };

type BaseState = {
    resultat: Nullable<SøknadsbehandlingResultat>;
    behandlingsperiode: Periode;
    antallDagerPerMeldeperiode: number;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

const baseActionHandlers = {
    setResultat: (state, payload: { resultat: SøknadsbehandlingResultat }) => {
        return { ...state, resultat: payload.resultat };
    },

    oppdaterDagerPerMeldeperiode: (state, payload: { antallDagerPerMeldeperiode: number }) => {
        return { ...state, antallDagerPerMeldeperiode: payload.antallDagerPerMeldeperiode };
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

    oppdaterBehandlingsperiode: (state, payload: { periode: Partial<Periode> }) => {
        return {
            ...state,
            behandlingsperiode: { ...state.behandlingsperiode, ...payload.periode },
        };
    },
} as const satisfies ReducerActionHandlers<SøknadsbehandlingSkjemaState, BaseActions>;

export type SøknadsbehandlingSkjemaActions =
    | BaseActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions;

export type SøknadsbehandlingSkjemaState = BaseState & BarnetilleggState & TiltaksdeltagelseState;

const actionHandlers = {
    ...getTiltaksdeltagelseActionHandlers<SøknadsbehandlingSkjemaState>(),
    ...getBarnetilleggActionHandlers<SøknadsbehandlingSkjemaState>(),
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
