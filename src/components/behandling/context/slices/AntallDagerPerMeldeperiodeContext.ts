import { ReducerActionHandlers } from '~/types/Context';
import { Nullable } from '~/types/UtilTypes';

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

export const antallDagerForMeldeperiodeActionHandlers = {
    oppdaterAntallDagerForMeldeperiode: (
        state,
        payload: { antallDager: AntallDagerPerMeldeperiodeFormData[] },
    ) => ({
        ...state,
        antallDagerPerMeldeperiode: payload.antallDager,
    }),
} as const satisfies ReducerActionHandlers<
    AntallDagerPerMeldeperiodeState,
    AntallDagerPerMeldeperiodeActions
>;
