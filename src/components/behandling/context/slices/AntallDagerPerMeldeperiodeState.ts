import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Periode } from '~/types/Periode';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { inneholderHelePerioden } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';

export type AntallDagerPerMeldeperiodeState = {
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiodeFormData[];
};

export type AntallDagerPerMeldeperiodeFormData = {
    antallDagerPerMeldeperiode: number;
    periode: {
        fraOgMed: string;
        tilOgMed: string;
    };
};

export type AntallDagerPerMeldeperiodeActions =
    | {
          type: 'leggTilAntallDagerPeriode';
      }
    | {
          type: 'fjernAntallDagerPeriode';
          payload: { index: number };
      }
    | {
          type: 'oppdaterAntallDagerPeriode';
          payload: { periode: Partial<Periode>; index: number };
      }
    | {
          type: 'settAntallDagerForPeriode';
          payload: { antallDager: number; index: number };
      }
    | {
          type: 'oppdaterAntallDagerPerioder';
          payload: { perioder: AntallDagerPerMeldeperiodeFormData[] };
      };

export const antallDagerPerMeldeperiodeActionHandlers = {
    leggTilAntallDagerPeriode: (state) => {
        const sistePeriode = state.antallDagerPerMeldeperiode.at(-1);

        if (!sistePeriode) {
            return {
                ...state,
                antallDagerPerMeldeperiode: [
                    {
                        antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                        periode: state.behandlingsperiode,
                    },
                ],
            };
        }

        const nyPeriode = {
            antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
            periode: {
                fraOgMed: datoMin(
                    nesteDag(sistePeriode.periode.tilOgMed),
                    state.behandlingsperiode.tilOgMed,
                ),
                tilOgMed: state.behandlingsperiode.tilOgMed,
            },
        };

        return {
            ...state,
            antallDagerPerMeldeperiode: oppdaterUtenOverlapp(
                state.antallDagerPerMeldeperiode,
                nyPeriode,
                state.antallDagerPerMeldeperiode.length,
            ),
        };
    },
    fjernAntallDagerPeriode: (state, { index }) => {
        return {
            ...state,
            antallDagerPerMeldeperiode: state.antallDagerPerMeldeperiode.toSpliced(index, 1),
        };
    },
    oppdaterAntallDagerPeriode: (state, { periode, index }) => {
        const eksisterendePeriode = state.antallDagerPerMeldeperiode.at(index);

        if (!eksisterendePeriode) {
            return state;
        }

        const oppdatertPeriode = {
            ...eksisterendePeriode,
            periode: {
                ...eksisterendePeriode.periode,
                ...periode,
            },
        };

        return {
            ...state,
            antallDagerPerMeldeperiode: oppdaterUtenOverlapp(
                state.antallDagerPerMeldeperiode,
                oppdatertPeriode,
                index,
            ),
        };
    },
    settAntallDagerForPeriode: (state, { antallDager, index }) => {
        const eksisterendePeriode = state.antallDagerPerMeldeperiode.at(index);

        if (!eksisterendePeriode) {
            return state;
        }

        return {
            ...state,
            antallDagerPerMeldeperiode: state.antallDagerPerMeldeperiode.with(index, {
                ...eksisterendePeriode,
                antallDagerPerMeldeperiode: antallDager,
            }),
        };
    },
    oppdaterAntallDagerPerioder: (state, { perioder }) => {
        return { ...state, antallDagerPerMeldeperiode: perioder };
    },
} as const satisfies BehandlingSkjemaActionHandlers<AntallDagerPerMeldeperiodeActions>;

const oppdaterUtenOverlapp = (
    perioder: AntallDagerPerMeldeperiodeFormData[],
    oppdatertPeriode: AntallDagerPerMeldeperiodeFormData,
    oppdatertIndex: number,
): AntallDagerPerMeldeperiodeFormData[] => {
    return perioder
        .toSpliced(oppdatertIndex, 1, oppdatertPeriode)
        .filter((it, index) => {
            if (index === oppdatertIndex) {
                return true;
            }

            return !inneholderHelePerioden(oppdatertPeriode.periode, it.periode);
        })
        .map((it) => {
            if (it === oppdatertPeriode) {
                return it;
            }

            const erTidligerePeriode = it.periode.fraOgMed < oppdatertPeriode.periode.fraOgMed;

            return {
                ...it,
                periode: erTidligerePeriode
                    ? {
                          fraOgMed: it.periode.fraOgMed,
                          tilOgMed: datoMin(
                              it.periode.tilOgMed,
                              forrigeDag(oppdatertPeriode.periode.fraOgMed),
                          ),
                      }
                    : {
                          fraOgMed: datoMax(
                              it.periode.fraOgMed,
                              nesteDag(oppdatertPeriode.periode.tilOgMed),
                          ),
                          tilOgMed: it.periode.tilOgMed,
                      },
            };
        });
};
