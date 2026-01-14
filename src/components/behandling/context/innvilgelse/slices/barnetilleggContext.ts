import { nesteDag } from '~/utils/date';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { InnvilgelseMedPerioderState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { oppdaterPeriodiseringUtenOverlapp } from '~/components/behandling/context/behandlingSkjemaUtils';
import { Periode } from '~/types/Periode';

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
          type: 'oppdaterBarnetilleggPeriode';
          payload: { periode: Partial<Periode>; index: number };
      }
    | {
          type: 'settBarnetilleggPerioder';
          payload: { barnetilleggPerioder: BarnetilleggPeriode[] };
      };

export const barnetilleggReducer: Reducer<InnvilgelseMedPerioderState, BarnetilleggActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'setHarSøktBarnetillegg': {
            return { ...state, harBarnetillegg: payload.harSøkt };
        }

        case 'addBarnetilleggPeriode': {
            const { antallBarn } = payload;
            const innvilgelsesPeriode = state.innvilgelsesperioder.at(0)!.periode;
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

        case 'settBarnetilleggPerioder': {
            return {
                ...state,
                barnetilleggPerioder: payload.barnetilleggPerioder,
                harBarnetillegg: payload.barnetilleggPerioder.length > 0,
            };
        }

        case 'oppdaterBarnetilleggAntall': {
            const { index, antall } = payload;

            const barnetilleggPeriode = state.barnetilleggPerioder.at(index)!;

            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.with(index, {
                    ...barnetilleggPeriode,
                    antallBarn: antall,
                }),
            };
        }

        case 'oppdaterBarnetilleggPeriode': {
            const { index, periode } = payload;

            const barnetilleggPeriode = state.barnetilleggPerioder.at(index)!;

            const oppdatertPeriode = {
                ...barnetilleggPeriode,
                periode: {
                    ...barnetilleggPeriode.periode,
                    ...periode,
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
};
