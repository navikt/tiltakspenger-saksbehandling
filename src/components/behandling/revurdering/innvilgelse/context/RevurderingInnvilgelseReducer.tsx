import { Reducer } from 'react';
import { Periode } from '~/types/Periode';
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

type BaseActions = {
    type: 'oppdaterBehandlingsperiode';
    payload: { periode: Partial<Periode> };
};

type BaseState = {
    behandlingsperiode: Periode;
};

const baseActionHandlers = {
    oppdaterBehandlingsperiode: (state, payload) => {
        return {
            ...state,
            behandlingsperiode: { ...state.behandlingsperiode, ...payload.periode },
        };
    },
} as const satisfies ReducerActionHandlers<RevurderingInnvilgelseSkjemaState, BaseActions>;

export type RevurderingInnvilgelseSkjemaActions =
    | BaseActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions;

export type RevurderingInnvilgelseSkjemaState = BaseState &
    TiltaksdeltagelseState &
    BarnetilleggState;

const actionHandlers = {
    ...getTiltaksdeltagelseActionHandlers<RevurderingInnvilgelseSkjemaState>(),
    ...getBarnetilleggActionHandlers<RevurderingInnvilgelseSkjemaState>(),
    ...baseActionHandlers,
} as const satisfies ReducerActionHandlers<
    RevurderingInnvilgelseSkjemaState,
    RevurderingInnvilgelseSkjemaActions
>;

export const RevurderingInnvilgelseReducer: Reducer<
    RevurderingInnvilgelseSkjemaState,
    RevurderingInnvilgelseSkjemaActions
> = (state, action): RevurderingInnvilgelseSkjemaState => {
    const { type, payload } = action;

    const handler = actionHandlers[type];
    if (handler) {
        // :sadpanda:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handler(state, payload as any);
    }

    console.error(`Ugyldig action for revurdering innvilgelse: "${type}"`);
    return state;
};
