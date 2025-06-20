import { Reducer } from 'react';
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
import { AntallDagerForMeldeperiodeState } from '~/components/behandling/felles/state/AntallDagerState';

export type RevurderingInnvilgelseSkjemaActions =
    | InnvilgelseActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions;

export type RevurderingInnvilgelseSkjemaState = InnvilgelseState &
    TiltaksdeltagelseState &
    BarnetilleggState &
    AntallDagerForMeldeperiodeState;

const actionHandlers = {
    ...getTiltaksdeltagelseActionHandlers<RevurderingInnvilgelseSkjemaState>(),
    ...getBarnetilleggActionHandlers<RevurderingInnvilgelseSkjemaState>(),
    ...getInnvilgelseActionHandlers<RevurderingInnvilgelseSkjemaState>(),
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
