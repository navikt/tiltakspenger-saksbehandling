import { ReducerActionHandlers } from '~/types/Context';
import { Nullable } from '~/types/UtilTypes';

export interface AntallDagerForMeldeperiodeState {
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiodeFormData[];
}

export interface AntallDagerForMeldeperiodeFormData {
    antallDagerPerMeldeperiode: Nullable<number>;
    periode: {
        fraOgMed: Nullable<string>;
        tilOgMed: Nullable<string>;
    };
}

export type AntallDagerForMeldeperiodeAction = {
    type: 'oppdaterAntallDagerForMeldeperiode';
    payload: { antallDager: AntallDagerForMeldeperiodeFormData[] };
};

export const getAntallDagerForMeldeperiodeActionHandler = <
    State extends AntallDagerForMeldeperiodeState,
>(): ReducerActionHandlers<State, AntallDagerForMeldeperiodeAction> =>
    ({
        oppdaterAntallDagerForMeldeperiode: (
            state,
            payload: { antallDager: AntallDagerForMeldeperiodeFormData[] },
        ) => {
            return {
                ...state,
                antallDagerPerMeldeperiode: payload.antallDager,
            };
        },
    }) as const;
