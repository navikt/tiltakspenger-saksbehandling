import { HjemmelForStans, RevurderingResultat } from '~/types/Revurdering';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/Context';
import {
    BehandlingSkjemaMedFritekst,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaActionSuperType } from '~/components/behandling/context/behandlingSkjemaUtils';

export type RevurderingStansState = {
    resultat: RevurderingResultat.STANS;
    fraDato?: string;
    harValgtStansFraFørsteDagSomGirRett: boolean;
    hjemlerForStans: HjemmelForStans[];
};

type Actions =
    | {
          type: 'setStansFraDato';
          payload: { fraDato: string };
      }
    | {
          type: 'setHjemlerForStans';
          payload: { hjemler: HjemmelForStans[] };
      }
    | {
          type: 'setHarValgtFørsteDagSomGirRett';
          payload: { harValgtFørsteDagSomGirRett?: boolean };
      };

export type RevurderingStansActions = ReducerSuperAction<
    Actions,
    BehandlingSkjemaActionSuperType.RevurderingStans
>;

export const revurderingStansReducer: Reducer<RevurderingStansState, RevurderingStansActions> = (
    state,
    action,
): RevurderingStansState => {
    const { type, payload } = action;

    switch (type) {
        case 'setStansFraDato':
            return {
                ...state,
                fraDato: payload.fraDato,
            };

        case 'setHjemlerForStans':
            return {
                ...state,
                hjemlerForStans: payload.hjemler,
            };

        case 'setHarValgtFørsteDagSomGirRett':
            return {
                ...state,
                harValgtStansFraFørsteDagSomGirRett:
                    payload.harValgtFørsteDagSomGirRett ??
                    state.harValgtStansFraFørsteDagSomGirRett,
            };
    }
};

export type RevurderingStansContext = BehandlingSkjemaMedFritekst<RevurderingStansState>;

export const useRevurderingStansSkjema = (): RevurderingStansContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.STANS) {
        throw Error(`Feil resultat for revurdering stans context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingStansSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: Actions) =>
        dispatch({ ...action, superType: BehandlingSkjemaActionSuperType.RevurderingStans });
};
