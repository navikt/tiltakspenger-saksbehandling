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

// Dette er copy-paste av revurdering innvilgelse for nå, men denne må sannsynligvis divergeres etter hvert

export type RevurderingOmgjøringState = {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelse: InnvilgelseState;
};

export type RevurderingOmgjøringActions = ReducerSuperAction<
    InnvilgelseActions,
    BehandlingSkjemaType.RevurderingOmgjøring
>;

export const revurderingOmgjøringReducer: Reducer<
    RevurderingOmgjøringState,
    RevurderingOmgjøringActions
> = (state, action) => {
    return { ...state, innvilgelse: innvilgelseReducer(state.innvilgelse, action) };
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

    return (action: InnvilgelseActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingOmgjøring });
};
