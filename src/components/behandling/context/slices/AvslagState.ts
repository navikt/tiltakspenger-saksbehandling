import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Avslagsgrunn } from '~/types/BehandlingTypes';

export type AvslagState = {
    avslagsgrunner: Avslagsgrunn[];
};

export type AvslagActions = {
    type: 'oppdaterAvslagsgrunn';
    payload: { avslagsgrunn: Avslagsgrunn };
};

export const avslagActionHandlers = {
    oppdaterAvslagsgrunn: (state, payload) => {
        if (state.avslagsgrunner.length === 0) {
            return {
                ...state,
                avslagsgrunner: [payload.avslagsgrunn],
            };
        }

        const eksistererAllerede = state.avslagsgrunner.includes(payload.avslagsgrunn);

        if (eksistererAllerede) {
            return {
                ...state,
                avslagsgrunner: state.avslagsgrunner.filter(
                    (grunn) => grunn !== payload.avslagsgrunn,
                ),
            };
        } else {
            return {
                ...state,
                avslagsgrunner: [...state.avslagsgrunner, payload.avslagsgrunn],
            };
        }
    },
} as const satisfies BehandlingSkjemaActionHandlers<AvslagActions>;
