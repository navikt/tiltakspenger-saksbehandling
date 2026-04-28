import { Reducer } from 'react';
import {
    SøknadsbehandlingActions,
    søknadsbehandlingReducer,
    SøknadsbehandlingState,
} from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    RevurderingStansActions,
    revurderingStansReducer,
    RevurderingStansState,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import {
    RevurderingInnvilgelseActions,
    revurderingInnvilgelseReducer,
    RevurderingInnvilgelseState,
} from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import {
    OmgjøringActions,
    omgjøringReducer,
    OmgjøringState,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import {
    BehandlingSkjemaType,
    erOmgjøringContext,
    erSøknadsbehandlingContext,
} from '~/lib/rammebehandling/context/behandlingSkjemaUtils';

export type BehandlingSkjemaState =
    | SøknadsbehandlingState
    | RevurderingInnvilgelseState
    | RevurderingStansState
    | OmgjøringState;

export type BehandlingSkjemaActions =
    | SøknadsbehandlingActions
    | RevurderingInnvilgelseActions
    | OmgjøringActions
    | RevurderingStansActions;

export const behandlingSkjemaReducer: Reducer<BehandlingSkjemaState, BehandlingSkjemaActions> = (
    state,
    action,
): BehandlingSkjemaState => {
    const { resultat } = state;
    const { superType, type } = action;

    switch (superType) {
        case BehandlingSkjemaType.Søknadsbehandling: {
            if (!erSøknadsbehandlingContext(state)) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre et søknadsbehandling resultat - var ${resultat}`,
                );
            }

            return søknadsbehandlingReducer(state, action);
        }

        case BehandlingSkjemaType.RevurderingInnvilgelse: {
            if (resultat !== RevurderingResultat.INNVILGELSE) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering innvilgelse - var ${resultat}`,
                );
            }

            return revurderingInnvilgelseReducer(state, action);
        }

        case BehandlingSkjemaType.RevurderingOmgjøring: {
            if (!erOmgjøringContext(state)) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering omgjøring - var ${resultat}`,
                );
            }

            return omgjøringReducer(state, action);
        }

        case BehandlingSkjemaType.RevurderingStans: {
            if (resultat !== RevurderingResultat.STANS) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering stans - var ${resultat}`,
                );
            }

            return revurderingStansReducer(state, action);
        }
    }
};
