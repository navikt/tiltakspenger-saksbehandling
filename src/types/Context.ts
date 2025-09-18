import { SøknadsbehandlingVedtakContext } from '~/components/behandling/søknadsbehandling/context/SøknadsbehandlingVedtakContext';
import { RevurderingInnvilgelseVedtakContext } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { RevurderingStansVedtakContext } from '~/components/behandling/revurdering/stans/RevurderingStansVedtakContext';

export type ReducerAction = {
    type: string;
    payload: Record<string, unknown>;
};

export type ReducerActionHandlers<State, Actions extends ReducerAction> = {
    [Type in Actions['type']]: (
        state: State,
        payload: Extract<Actions, { type: Type }>['payload'],
    ) => State;
};

export type VedtakContext =
    | SøknadsbehandlingVedtakContext
    | RevurderingInnvilgelseVedtakContext
    | RevurderingStansVedtakContext;
