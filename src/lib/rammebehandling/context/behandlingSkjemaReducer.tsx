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
    RevurderingForlengelseActions,
    revurderingForlengelseReducer,
    RevurderingForlengelseState,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
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
import {
    BehandlingSkjemaFellesActions,
    behandlingSkjemaFellesReducer,
    BehandlingSkjemaFellesState,
    hentBehandlingSkjemaFellesState,
} from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';

export type BehandlingSkjemaResultatState =
    | SøknadsbehandlingState
    | RevurderingInnvilgelseState
    | RevurderingForlengelseState
    | RevurderingStansState
    | OmgjøringState;

export type BehandlingSkjemaState = BehandlingSkjemaFellesState & BehandlingSkjemaResultatState;

export type BehandlingSkjemaActions =
    | BehandlingSkjemaFellesActions
    | SøknadsbehandlingActions
    | RevurderingInnvilgelseActions
    | RevurderingForlengelseActions
    | OmgjøringActions
    | RevurderingStansActions;

export const behandlingSkjemaReducer: Reducer<BehandlingSkjemaState, BehandlingSkjemaActions> = (
    state,
    action,
): BehandlingSkjemaState => {
    const { resultat } = state;
    const { superType, type } = action;

    // Reducerne for resultatene kan bytte ut hele staten når resultatet endres, så fellesfeltene må bevares her
    const medFellesState = (
        resultatState: BehandlingSkjemaResultatState,
    ): BehandlingSkjemaState => ({
        ...resultatState,
        ...hentBehandlingSkjemaFellesState(state),
    });

    switch (superType) {
        case BehandlingSkjemaType.Felles: {
            return {
                ...state,
                ...behandlingSkjemaFellesReducer(hentBehandlingSkjemaFellesState(state), action),
            };
        }

        case BehandlingSkjemaType.Søknadsbehandling: {
            if (!erSøknadsbehandlingContext(state)) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre et søknadsbehandling resultat - var ${resultat}`,
                );
            }

            return medFellesState(søknadsbehandlingReducer(state, action));
        }

        case BehandlingSkjemaType.RevurderingInnvilgelse: {
            if (resultat !== RevurderingResultat.INNVILGELSE) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering innvilgelse - var ${resultat}`,
                );
            }

            return medFellesState(revurderingInnvilgelseReducer(state, action));
        }

        case BehandlingSkjemaType.RevurderingForlengelse: {
            if (resultat !== RevurderingResultat.FORLENGELSE) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en forlengelse - var ${resultat}`,
                );
            }

            return medFellesState(revurderingForlengelseReducer(state, action));
        }

        case BehandlingSkjemaType.RevurderingOmgjøring: {
            if (!erOmgjøringContext(state)) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering omgjøring - var ${resultat}`,
                );
            }

            return medFellesState(omgjøringReducer(state, action));
        }

        case BehandlingSkjemaType.RevurderingStans: {
            if (resultat !== RevurderingResultat.STANS) {
                throw Error(
                    `Action ${type} / ${superType} må tilhøre en revurdering stans - var ${resultat}`,
                );
            }

            return medFellesState(revurderingStansReducer(state, action));
        }
    }
};
