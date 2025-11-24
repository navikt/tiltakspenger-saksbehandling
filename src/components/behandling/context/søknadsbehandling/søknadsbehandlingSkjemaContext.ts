import {
    Avslagsgrunn,
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/types/Søknadsbehandling';
import {
    BehandlingInnvilgelseActions,
    behandlingInnvilgelseReducer,
    BehandlingInnvilgelseState,
} from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/Context';
import { søknadsbehandlingInitialState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingInitialState';
import {
    BehandlingSkjemaMedFritekst,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import {
    BehandlingSkjemaType,
    erSøknadsbehandlingContext,
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { removeDuplicates } from '~/utils/array';

export type SøknadsbehandlingIkkeValgtState = {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT;
};

export type SøknadsbehandlingAvslagState = {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
};

export type SøknadsbehandlingInnvilgelseState = BehandlingInnvilgelseState & {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
};

export type SøknadsbehandlingState =
    | SøknadsbehandlingIkkeValgtState
    | SøknadsbehandlingAvslagState
    | SøknadsbehandlingInnvilgelseState;

type SøknadsbehandlingAvslagAction = {
    type: 'oppdaterAvslagsgrunn';
    payload: { avslagsgrunn: Avslagsgrunn };
};

type SøknadsbehandlingSetResultatAction = {
    type: 'setResultat';
    payload: { resultat: SøknadsbehandlingResultat; behandling: Søknadsbehandling };
};

type Actions =
    | SøknadsbehandlingSetResultatAction
    | SøknadsbehandlingAvslagAction
    | BehandlingInnvilgelseActions;

export type SøknadsbehandlingActions = ReducerSuperAction<
    Actions,
    BehandlingSkjemaType.Søknadsbehandling
>;

export const søknadsbehandlingReducer: Reducer<SøknadsbehandlingState, SøknadsbehandlingActions> = (
    state,
    action,
): SøknadsbehandlingState => {
    const { resultat } = state;
    const { type, payload } = action;

    switch (type) {
        case 'setResultat': {
            const { resultat: nyttResultat, behandling } = payload;
            return søknadsbehandlingInitialState(behandling, nyttResultat);
        }

        case 'oppdaterAvslagsgrunn': {
            if (resultat !== SøknadsbehandlingResultat.AVSLAG) {
                throw Error('Behandlingen må være et avslag for å sette avslagsgrunn');
            }

            const { avslagsgrunn } = payload;

            return {
                ...state,
                avslagsgrunner: [...state.avslagsgrunner, avslagsgrunn].filter(removeDuplicates),
            };
        }

        case 'oppdaterInnvilgelsesperiode':
        case 'leggTilAntallDagerPeriode':
        case 'fjernAntallDagerPeriode':
        case 'oppdaterAntallDagerFraOgMed':
        case 'oppdaterAntallDagerTilOgMed':
        case 'settAntallDagerForPeriode':
        case 'setHarSøktBarnetillegg':
        case 'addBarnetilleggPeriode':
        case 'fjernBarnetilleggPeriode':
        case 'oppdaterBarnetilleggAntall':
        case 'oppdaterBarnetilleggFraOgMed':
        case 'oppdaterBarnetilleggTilOgMed':
        case 'nullstillBarnetilleggPerioder':
        case 'addTiltakPeriode':
        case 'fjernTiltakPeriode':
        case 'oppdaterTiltakId':
        case 'oppdaterTiltaksdeltagelseFraOgMed':
        case 'oppdaterTiltaksdeltagelseTilOgMed': {
            if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
                throw Error(`Behandlingen må være en innvilgelse for action type ${type}`);
            }

            return behandlingInnvilgelseReducer(state, action);
        }
    }

    throw Error(`Ugyldig action for søknadsbehandling: ${type satisfies never}`);
};

export type SøknadsbehandlingSkjemaContext = BehandlingSkjemaMedFritekst<SøknadsbehandlingState>;

export const useSøknadsbehandlingSkjema = (): SøknadsbehandlingSkjemaContext => {
    const context = useBehandlingSkjema();

    if (!erSøknadsbehandlingContext(context)) {
        throw Error(`Feil resultat for søknadsbehandling context: ${context.resultat}`);
    }

    return context;
};

export type SøknadsbehandlingAvslagContext =
    BehandlingSkjemaMedFritekst<SøknadsbehandlingAvslagState>;

export const useSøknadsbehandlingAvslagSkjema = (): SøknadsbehandlingAvslagContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== SøknadsbehandlingResultat.AVSLAG) {
        throw Error(`Feil resultat for søknadsbehandling avslag context: ${context.resultat}`);
    }

    return context;
};

export const useSøknadsbehandlingSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: Actions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.Søknadsbehandling });
};
