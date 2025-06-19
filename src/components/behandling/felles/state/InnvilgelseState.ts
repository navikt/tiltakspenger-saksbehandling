import { Periode } from '~/types/Periode';
import { ReducerActionHandlers } from '~/types/Context';

export type InnvilgelseState = {
    behandlingsperiode: Periode;
};

export type InnvilgelseActions = {
    type: 'oppdaterBehandlingsperiode';
    payload: { periode: Partial<Periode> };
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
    }) as const;
