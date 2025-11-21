import { Periode } from '~/types/Periode';
import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { inneholderHelePerioden } from '~/utils/periode';
import { datoMax, datoMin, forrigeDag, nesteDag } from '~/utils/date';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';

export type AntallDagerPerMeldeperiodeFormData = {
    antallDagerPerMeldeperiode: number;
    periode: Periode;
};

export type AntallDagerPerMeldeperiodeActions =
    | {
          type: 'leggTilAntallDagerPeriode';
          payload?: undefined;
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

export const antallDagerPerMeldeperiodeReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: AntallDagerPerMeldeperiodeActions,
): State => {
    const { type, payload } = action;

    switch (type) {
        case 'leggTilAntallDagerPeriode': {
            const sistePeriode = state.antallDagerPerMeldeperiode.at(-1);
            const innvilgelsesperiode = state.innvilgelsesperiode as Periode;

            if (!sistePeriode?.periode?.fraOgMed || !sistePeriode?.periode?.tilOgMed) {
                return {
                    ...state,
                    antallDagerPerMeldeperiode: [
                        {
                            antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                            periode: innvilgelsesperiode,
                        },
                    ],
                };
            }

            const nyPeriode = {
                antallDagerPerMeldeperiode: ANTALL_DAGER_DEFAULT,
                periode: {
                    fraOgMed: datoMin(
                        nesteDag(sistePeriode.periode.tilOgMed),
                        innvilgelsesperiode.tilOgMed,
                    ),
                    tilOgMed: innvilgelsesperiode.tilOgMed,
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
        }

        case 'fjernAntallDagerPeriode': {
            const { index } = payload;

            return {
                ...state,
                antallDagerPerMeldeperiode: state.antallDagerPerMeldeperiode.toSpliced(index, 1),
            };
        }

        case 'oppdaterAntallDagerFraOgMed': {
            const { index, fraOgMed } = payload;

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
        }

        case 'oppdaterAntallDagerTilOgMed': {
            const { index, tilOgMed } = payload;

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
        }

        case 'settAntallDagerForPeriode': {
            const { index, antallDager } = payload;

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
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, AntallDagerPerMeldeperiodeActions>;

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
