import { RevurderingResultat } from '~/types/Revurdering';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/Context';
import {
    InnvilgelseActions,
    innvilgelseReducer,
    InnvilgelseState,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import {
    BehandlingSkjemaMedFritekst,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/components/behandling/context/behandlingSkjemaUtils';

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
    BehandlingSkjemaMedFritekst<RevurderingInnvilgelseState>;

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
