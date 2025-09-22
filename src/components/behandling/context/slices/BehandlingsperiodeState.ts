import { Periode } from '~/types/Periode';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Nullable } from '~/types/UtilTypes';
import { BehandlingResultat } from '~/types/BehandlingTypes';

export type BehandlingsperiodeState = {
    resultat: Nullable<BehandlingResultat>;
    behandlingsperiode: Periode;
};

export type BehandlingsperiodeActions =
    | {
          type: 'setResultat';
          payload: { resultat: BehandlingResultat | null };
      }
    | {
          type: 'oppdaterBehandlingsperiode';
          payload: { periode: Partial<Periode> };
      };

export const behandlingsperiodeActionHandlers = {
    setResultat: (state, payload) => {
        return { ...state, resultat: payload.resultat };
    },

    oppdaterBehandlingsperiode: (state, payload) => {
        return {
            ...state,
            behandlingsperiode: { ...state.behandlingsperiode, ...payload.periode },
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<BehandlingsperiodeActions>;
