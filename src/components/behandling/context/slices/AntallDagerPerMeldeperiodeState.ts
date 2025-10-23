import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { Periode, PeriodeMedNullable } from '~/types/Periode';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { inneholderHelePerioden } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';

export type AntallDagerPerMeldeperiodeState = {
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiodeFormData[];
};

export type AntallDagerPerMeldeperiodeFormData = {
    antallDagerPerMeldeperiode: number;
    periode: PeriodeMedNullable;
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
          type: 'oppdaterAntallDagerFraOgMed';
          payload: { fraOgMed: string; index: number };
      }
    | {
          type: 'oppdaterAntallDagerTilOgMed';
          payload: { tilOgMed: string; index: number };
      }
    | {
          type: 'settAntallDagerForPeriode';
          payload: { antallDager: number; index: number };
      };

export const antallDagerPerMeldeperiodeActionHandlers = {
    leggTilAntallDagerPeriode: (state) => {
        const sistePeriode = state.antallDagerPerMeldeperiode.at(-1);
        const behandlingsperiode = state.behandlingsperiode as Periode;

        if (!sistePeriode?.periode?.fraOgMed || !sistePeriode?.periode?.tilOgMed) {
            return {
                ...state,
                antallDagerPerMeldeperiode: [
                    {
                        antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                        periode: behandlingsperiode,
                    },
                ],
            };
        }

        const nyPeriode = {
            antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
            periode: {
                fraOgMed: datoMin(
                    nesteDag(sistePeriode.periode.tilOgMed),
                    behandlingsperiode.tilOgMed,
                ),
                tilOgMed: behandlingsperiode.tilOgMed,
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
    oppdaterAntallDagerFraOgMed: (state, { fraOgMed, index }) => {
        const eksisterendePeriode = state.antallDagerPerMeldeperiode.at(index);

        if (!eksisterendePeriode) {
            return state;
        }

        const oppdatertPeriode = {
            ...eksisterendePeriode,
            periode: {
                fraOgMed: fraOgMed,
                tilOgMed: eksisterendePeriode.periode?.tilOgMed ?? fraOgMed,
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
    oppdaterAntallDagerTilOgMed: (state, { tilOgMed, index }) => {
        const eksisterendePeriode = state.antallDagerPerMeldeperiode.at(index);

        if (!eksisterendePeriode) {
            return state;
        }

        const oppdatertPeriode = {
            ...eksisterendePeriode,
            periode: {
                fraOgMed: eksisterendePeriode.periode?.fraOgMed ?? tilOgMed,
                tilOgMed: tilOgMed,
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

            return oppdatertPeriode.periode.fraOgMed &&
                oppdatertPeriode.periode.tilOgMed &&
                it.periode.fraOgMed &&
                it.periode.tilOgMed
                ? !inneholderHelePerioden(
                      oppdatertPeriode.periode as Periode,
                      it.periode as Periode,
                  )
                : true;
        })
        .map((it) => {
            if (it === oppdatertPeriode) {
                return it;
            }

            if (
                !it.periode.fraOgMed ||
                !it.periode.tilOgMed ||
                !oppdatertPeriode.periode.fraOgMed ||
                !oppdatertPeriode.periode.tilOgMed
            ) {
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
