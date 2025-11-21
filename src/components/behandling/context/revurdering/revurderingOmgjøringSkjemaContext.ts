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

// Dette er copy-paste av revurdering innvilgelse for nå, men denne må sannsynligvis divergeres etter hvert

export type RevurderingOmgjøringState = BehandlingInnvilgelseState & {
    resultat: RevurderingResultat.OMGJØRING;
};

export type RevurderingOmgjøringActions = ReducerSuperAction<
    BehandlingInnvilgelseActions,
    BehandlingSkjemaActionSuperType.RevurderingOmgjøring
>;

export const revurderingOmgjøringReducer: Reducer<
    RevurderingOmgjøringState,
    RevurderingOmgjøringActions
> = (state, action) => {
    return behandlingInnvilgelseReducer(state, action);
};

export type RevurderingOmgjøringContext = BehandlingSkjemaMedFritekst<RevurderingOmgjøringState>;

export const useRevurderingOmgjøringSkjema = (): RevurderingOmgjøringContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.OMGJØRING) {
        throw Error(`Feil resultat for revurdering omgjøring context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingOmgjøringSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: BehandlingInnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaActionSuperType.RevurderingOmgjøring });
};
