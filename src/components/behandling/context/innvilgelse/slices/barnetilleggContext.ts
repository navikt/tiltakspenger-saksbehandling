import { nesteDag } from '~/utils/date';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { BarnetilleggPeriodeFormData } from '../../../felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';
import { oppdaterPeriodiseringUtenOverlapp } from '~/components/behandling/context/behandlingSkjemaUtils';

export type BarnetilleggActions =
    | {
          type: 'setHarSøktBarnetillegg';
          payload: { harSøkt: boolean };
      }
    | {
          type: 'addBarnetilleggPeriode';
          payload: { antallBarn: number };
      }
    | {
          type: 'fjernBarnetilleggPeriode';
          payload: { index: number };
      }
    | {
          type: 'oppdaterBarnetilleggAntall';
          payload: { antall: number; index: number };
      }
    | {
          type: 'oppdaterBarnetilleggFraOgMed';
          payload: { fraOgMed: string; index: number };
      }
    | {
          type: 'oppdaterBarnetilleggTilOgMed';
          payload: { tilOgMed: string; index: number };
      }
    | {
          type: 'nullstillBarnetilleggPerioder';
          payload: { barnetilleggPerioder: BarnetilleggPeriodeFormData[] };
      };

export const barnetilleggReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: BarnetilleggActions,
): State => {
    const { type, payload } = action;

    switch (type) {
        case 'setHarSøktBarnetillegg': {
            return { ...state, harBarnetillegg: payload.harSøkt };
        }

        case 'addBarnetilleggPeriode': {
            const { antallBarn } = payload;
            const innvilgelsesPeriode = state.innvilgelsesperiode;
            const forrigeBarnetillegg = state.barnetilleggPerioder?.at(-1);

            if (!forrigeBarnetillegg) {
                return {
                    ...state,
                    barnetilleggPerioder: [
                        {
                            antallBarn,
                            periode: innvilgelsesPeriode,
                        },
                    ],
                };
            }

            const nyBarnetilleggperiode: BarnetilleggPeriode = {
                antallBarn,
                periode: {
                    fraOgMed:
                        innvilgelsesPeriode.tilOgMed > forrigeBarnetillegg.periode.tilOgMed
                            ? nesteDag(forrigeBarnetillegg.periode.tilOgMed)
                            : innvilgelsesPeriode.tilOgMed,
                    tilOgMed: innvilgelsesPeriode.tilOgMed,
                },
            };

            return {
                ...state,
                barnetilleggPerioder: [...state.barnetilleggPerioder, nyBarnetilleggperiode],
            };
        }

        case 'fjernBarnetilleggPeriode': {
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.toSpliced(payload.index, 1),
            };
        }

        case 'nullstillBarnetilleggPerioder': {
            return {
                ...state,
                barnetilleggPerioder: payload.barnetilleggPerioder,
            };
        }

        case 'oppdaterBarnetilleggAntall': {
            const { index, antall } = payload;

            const barnetilleggPeriode = state.barnetilleggPerioder.at(index);

            if (!barnetilleggPeriode) {
                return state;
            }

            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.with(index, {
                    ...barnetilleggPeriode,
                    antallBarn: antall,
                }),
            };
        }

        case 'oppdaterBarnetilleggFraOgMed': {
            const { index, fraOgMed } = payload;

            const barnetilleggPeriode = state.barnetilleggPerioder.at(index);

            if (!barnetilleggPeriode) {
                return state;
            }

            const oppdatertPeriode = {
                ...barnetilleggPeriode,
                periode: {
                    ...barnetilleggPeriode.periode,
                    fraOgMed,
                },
            };

            return {
                ...state,
                barnetilleggPerioder: oppdaterPeriodiseringUtenOverlapp(
                    state.barnetilleggPerioder,
                    oppdatertPeriode,
                    index,
                ),
            };
        }

        case 'oppdaterBarnetilleggTilOgMed': {
            const { index, tilOgMed } = payload;

            const barnetilleggPeriode = state.barnetilleggPerioder.at(index);

            if (!barnetilleggPeriode) {
                return state;
            }

            const oppdatertPeriode = {
                ...barnetilleggPeriode,
                periode: {
                    ...barnetilleggPeriode.periode,
                    tilOgMed,
                },
            };

            return {
                ...state,
                barnetilleggPerioder: oppdaterPeriodiseringUtenOverlapp(
                    state.barnetilleggPerioder,
                    oppdatertPeriode,
                    index,
                ),
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, BarnetilleggActions>;
