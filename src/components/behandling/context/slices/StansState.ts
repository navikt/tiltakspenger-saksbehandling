import { HjemmelForStans } from '~/types/BehandlingTypes';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';

export type StansState = {
    hjemlerForStans: HjemmelForStans[];
    harValgtStansFraFørsteDagSomGirRett: boolean;
    harValgtStansTilSisteDagSomGirRett: boolean;
};

export type StansActions =
    | {
          type: 'setHjemlerForStans';
          payload: { hjemler: HjemmelForStans[] };
      }
    | {
          type: 'setHarValgtFørsteDagSomGirRett';
          payload: { harValgtFørsteDagSomGirRett?: boolean };
      }
    | {
          type: 'setHarValgtSisteDagSomGirRett';
          payload: { harValgtSisteDagSomGirRett?: boolean };
      };

export const stansActionHandlers = {
    setHjemlerForStans: (state, payload) => {
        return {
            ...state,
            hjemlerForStans: payload.hjemler,
        };
    },
    setHarValgtFørsteDagSomGirRett: (state, payload) => {
        return {
            ...state,
            harValgtStansFraFørsteDagSomGirRett:
                payload.harValgtFørsteDagSomGirRett ?? state.harValgtStansFraFørsteDagSomGirRett,
        };
    },
    setHarValgtSisteDagSomGirRett: (state, payload) => {
        return {
            ...state,
            harValgtStansTilSisteDagSomGirRett:
                payload.harValgtSisteDagSomGirRett ?? state.harValgtStansTilSisteDagSomGirRett,
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<StansActions>;
