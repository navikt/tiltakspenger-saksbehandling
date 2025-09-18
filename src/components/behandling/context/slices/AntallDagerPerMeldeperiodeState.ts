import { Nullable } from '~/types/UtilTypes';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';

export type AntallDagerPerMeldeperiodeState = {
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiodeFormData[];
};

export type AntallDagerPerMeldeperiodeFormData = {
    antallDagerPerMeldeperiode: Nullable<number>;
    periode: {
        fraOgMed: Nullable<string>;
        tilOgMed: Nullable<string>;
    };
};

export type AntallDagerPerMeldeperiodeActions = {
    type: 'oppdaterAntallDagerForMeldeperiode';
    payload: { antallDager: AntallDagerPerMeldeperiodeFormData[] };
};

export const antallDagerPerMeldeperiodeActionHandlers = {
    oppdaterAntallDagerForMeldeperiode: (
        state,
        payload: { antallDager: AntallDagerPerMeldeperiodeFormData[] },
    ) => ({
        ...state,
        antallDagerPerMeldeperiode: payload.antallDager,
    }),
} as const satisfies BehandlingSkjemaActionHandlers<AntallDagerPerMeldeperiodeActions>;
