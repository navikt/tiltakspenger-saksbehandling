import { Periode } from '~/types/Periode';
import { ReducerActionHandlers } from '~/types/Context';

export type BehandlingsperiodeState = {
    behandlingsperiode: Periode;
};

export type BehandlingsperiodeActions = {
    type: 'oppdaterBehandlingsperiode';
    payload: { periode: Partial<Periode> };
};

export const behandlingsperiodeActionHandlers = {
    oppdaterBehandlingsperiode: (state, payload: { periode: Partial<Periode> }) => {
        return {
            ...state,
            behandlingsperiode: { ...state.behandlingsperiode, ...payload.periode },
        };
    },
} as const satisfies ReducerActionHandlers<BehandlingsperiodeState, BehandlingsperiodeActions>;
