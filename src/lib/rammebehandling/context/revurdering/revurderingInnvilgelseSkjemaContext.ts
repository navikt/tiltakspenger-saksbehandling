import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/ReducerAction';
import {
    InnvilgelseActions,
    innvilgelseReducer,
    InnvilgelseState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    BehandlingSkjemaContextBase,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';

export type RevurderingInnvilgelseState = {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelse: InnvilgelseState;
};

export type RevurderingInnvilgelseActions = ReducerSuperAction<
    InnvilgelseActions,
    BehandlingSkjemaType.RevurderingInnvilgelse
>;

export const revurderingInnvilgelseReducer: Reducer<
    RevurderingInnvilgelseState,
    RevurderingInnvilgelseActions
> = (state, action) => {
    return { ...state, innvilgelse: innvilgelseReducer(state.innvilgelse, action) };
};

export type RevurderingInnvilgelseContext =
    BehandlingSkjemaContextBase<RevurderingInnvilgelseState>;

export const useRevurderingInnvilgelseSkjema = (): RevurderingInnvilgelseContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.INNVILGELSE) {
        throw Error(`Feil resultat for revurdering innvilgelse context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingInnvilgelseSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: InnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingInnvilgelse });
};
