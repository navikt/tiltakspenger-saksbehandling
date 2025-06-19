import { Periode } from '~/types/Periode';
import { ReducerActionHandlers } from '~/types/Context';

export type InnvilgelseState = {
    behandlingsperiode: Periode;
    antallDagerPerMeldeperiode: number;
};

export type InnvilgelseActions =
    | {
          type: 'oppdaterBehandlingsperiode';
          payload: { periode: Partial<Periode> };
      }
    | {
          type: 'oppdaterDagerPerMeldeperiode';
          payload: { antallDagerPerMeldeperiode: number };
      };

export const getInnvilgelseActionHandlers = <
    State extends InnvilgelseState,
>(): ReducerActionHandlers<State, InnvilgelseActions> =>
    ({
        oppdaterBehandlingsperiode: (state, payload: { periode: Partial<Periode> }) => {
            return {
                ...state,
                behandlingsperiode: { ...state.behandlingsperiode, ...payload.periode },
            };
        },

        oppdaterDagerPerMeldeperiode: (state, payload: { antallDagerPerMeldeperiode: number }) => {
            return { ...state, antallDagerPerMeldeperiode: payload.antallDagerPerMeldeperiode };
        },
    }) as const;
