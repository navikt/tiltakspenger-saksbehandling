import { HjemmelForStans } from '~/types/BehandlingTypes';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';

export type StansState = {
    hjemlerForStans: HjemmelForStans[];
};

export type StansActions = {
    type: 'setHjemlerForStans';
    payload: { hjemler: HjemmelForStans[] };
};

export const stansActionHandlers = {
    setHjemlerForStans: (state, payload) => {
        return { ...state, hjemlerForStans: payload.hjemler };
    },
} as const satisfies BehandlingSkjemaActionHandlers<StansActions>;
