import { HjemmelForStans } from '~/types/BehandlingTypes';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Nullable } from '~/types/UtilTypes';

export type StansState = {
    hjemlerForStans: Nullable<HjemmelForStans[]>;
};

export type StansActions = {
    type: 'setHjemler';
    payload: { hjemler: HjemmelForStans[] };
};

export const stansActionHandlers = {
    setHjemler: (state, payload) => {
        return { ...state, hjemlerForStans: payload.hjemler };
    },
} as const satisfies BehandlingSkjemaActionHandlers<StansActions>;
