import { ANTALL_DAGER_DEFAULT } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { datoMin, nesteDag } from '~/utils/date';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';
import { oppdaterPeriodiseringUtenOverlapp } from '~/components/behandling/context/behandlingSkjemaUtils';

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
            const { innvilgelsesperiode, antallDagerPerMeldeperiode } = state;

            const forrigePeriode = antallDagerPerMeldeperiode.at(-1);

            if (!forrigePeriode) {
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
                antallDagerPerMeldeperiode: forrigePeriode.antallDagerPerMeldeperiode,
                periode: {
                    fraOgMed: datoMin(
                        nesteDag(forrigePeriode.periode.tilOgMed),
                        innvilgelsesperiode.tilOgMed,
                    ),
                    tilOgMed: innvilgelsesperiode.tilOgMed,
                },
            };

            return {
                ...state,
                antallDagerPerMeldeperiode: oppdaterPeriodiseringUtenOverlapp(
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
                antallDagerPerMeldeperiode: oppdaterPeriodiseringUtenOverlapp(
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
                antallDagerPerMeldeperiode: oppdaterPeriodiseringUtenOverlapp(
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
