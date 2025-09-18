import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Nullable } from '~/types/UtilTypes';
import { Avslagsgrunn } from '~/types/BehandlingTypes';

export type AvslagState = {
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

export type AvslagActions = {
    type: 'oppdaterAvslagsgrunn';
    payload: { avslagsgrunn: Avslagsgrunn };
};

export const avslagActionHandlers = {
    oppdaterAvslagsgrunn: (state, payload: { avslagsgrunn: Avslagsgrunn }) => {
        if (state.avslagsgrunner === null) {
            return {
                ...state,
                avslagsgrunner: [payload.avslagsgrunn],
            };
        }

        const eksistererAllerede = state.avslagsgrunner.includes(payload.avslagsgrunn);

        if (eksistererAllerede) {
            const newArr = state.avslagsgrunner.filter((grunn) => grunn !== payload.avslagsgrunn);

            if (newArr.length === 0) {
                return { ...state, avslagsgrunner: null };
            } else {
                return { ...state, avslagsgrunner: newArr };
            }
        } else {
            return {
                ...state,
                avslagsgrunner: [...state.avslagsgrunner, payload.avslagsgrunn],
            };
        }
    },
} as const satisfies BehandlingSkjemaActionHandlers<AvslagActions>;
