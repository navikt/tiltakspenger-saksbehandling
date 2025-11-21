import { RevurderingResultat } from '~/types/Revurdering';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/Context';
import {
    BehandlingInnvilgelseActions,
    behandlingInnvilgelseReducer,
    BehandlingInnvilgelseState,
} from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import {
    BehandlingSkjemaMedFritekst,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaActionSuperType } from '~/components/behandling/context/behandlingSkjemaUtils';

export interface RevurderingInnvilgelseState extends BehandlingInnvilgelseState {
    resultat: RevurderingResultat.INNVILGELSE;
}

export type RevurderingInnvilgelseActions = ReducerSuperAction<
    BehandlingInnvilgelseActions,
    BehandlingSkjemaActionSuperType.RevurderingInnvilgelse
>;

export const revurderingInnvilgelseReducer: Reducer<
    RevurderingInnvilgelseState,
    RevurderingInnvilgelseActions
> = (state, action) => {
    return behandlingInnvilgelseReducer(state, action);
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

    return (action: BehandlingInnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaActionSuperType.RevurderingInnvilgelse });
};
