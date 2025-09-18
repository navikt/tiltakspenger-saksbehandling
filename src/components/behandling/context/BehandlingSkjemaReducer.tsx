import { Reducer } from 'react';
import {
    antallDagerPerMeldeperiodeActionHandlers,
    AntallDagerPerMeldeperiodeActions,
    AntallDagerPerMeldeperiodeState,
} from '~/components/behandling/context/slices/AntallDagerPerMeldeperiodeState';
import {
    behandlingsperiodeActionHandlers,
    BehandlingsperiodeActions,
    BehandlingsperiodeState,
} from '~/components/behandling/context/slices/BehandlingsperiodeState';
import {
    avslagActionHandlers,
    AvslagActions,
    AvslagState,
} from '~/components/behandling/context/slices/AvslagState';
import { ReducerAction, ReducerActionHandlers } from '~/types/Context';
import {
    tiltaksdeltagelseActionHandlers,
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/context/slices/TiltaksdeltagelseState';
import {
    barnetilleggActionHandlers,
    BarnetilleggActions,
    BarnetilleggState,
} from '~/components/behandling/context/slices/BarnetilleggState';
import {
    stansActionHandlers,
    StansActions,
    StansState,
} from '~/components/behandling/context/slices/StansState';

export type BehandlingSkjemaState = BehandlingsperiodeState &
    TiltaksdeltagelseState &
    BarnetilleggState &
    AntallDagerPerMeldeperiodeState &
    AvslagState &
    StansState;

export type BehandlingSkjemaActions =
    | BehandlingsperiodeActions
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | AntallDagerPerMeldeperiodeActions
    | AvslagActions
    | StansActions;

export type BehandlingSkjemaActionHandlers<Actions extends ReducerAction> = ReducerActionHandlers<
    BehandlingSkjemaState,
    Actions
>;

const actionsHandlers = {
    ...behandlingsperiodeActionHandlers,
    ...tiltaksdeltagelseActionHandlers,
    ...barnetilleggActionHandlers,
    ...antallDagerPerMeldeperiodeActionHandlers,
    ...avslagActionHandlers,
    ...stansActionHandlers,
} as const satisfies ReducerActionHandlers<BehandlingSkjemaState, BehandlingSkjemaActions>;

export const BehandlingSkjemaReducer: Reducer<BehandlingSkjemaState, BehandlingSkjemaActions> = (
    state,
    action,
): BehandlingSkjemaState => {
    const { type, payload } = action;

    const handler = actionsHandlers[type];
    if (handler) {
        // Typen for ReducerAction er ikke helt 100% :|
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handler(state, payload as any);
    }

    console.error(`Ugyldig action for behandling skjema: "${type as never}"`);
    return state;
};
