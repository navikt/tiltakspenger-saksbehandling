import { Periode } from '~/types/Periode';
import { forrigeDag, nesteDag } from '~/utils/date';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { BarnetilleggPeriodeFormData } from '../../../felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';

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
            const innvilgelsesPeriode = state.behandlingsperiode as Periode;
            const forrigeBarnetillegg = state.barnetilleggPerioder?.at(-1);

            const nestePeriode: Periode = forrigeBarnetillegg
                ? {
                      fraOgMed:
                          forrigeBarnetillegg.periode?.tilOgMed &&
                          innvilgelsesPeriode.tilOgMed > forrigeBarnetillegg.periode.tilOgMed
                              ? nesteDag(forrigeBarnetillegg.periode.tilOgMed)
                              : innvilgelsesPeriode.tilOgMed,
                      tilOgMed: innvilgelsesPeriode.tilOgMed,
                  }
                : innvilgelsesPeriode;

            const nyBarnetilleggperiode: BarnetilleggPeriode = {
                antallBarn: forrigeBarnetillegg?.antallBarn || antallBarn || 1,
                periode: nestePeriode,
            };

            return {
                ...state,
                barnetilleggPerioder: [
                    ...(state.barnetilleggPerioder || []),
                    nyBarnetilleggperiode,
                ],
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
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((periode, index) =>
                    index === payload.index ? { ...periode, antallBarn: payload.antall } : periode,
                ),
            };
        }

        case 'oppdaterBarnetilleggFraOgMed': {
            const { index: oppdatertIndex, fraOgMed } = payload;
            const forrigePeriode = state.barnetilleggPerioder[oppdatertIndex]?.periode ?? null;

            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((barnetillegg, index) => {
                    if (
                        index === oppdatertIndex - 1 &&
                        fraOgMed &&
                        forrigePeriode?.fraOgMed &&
                        fraOgMed < forrigePeriode.fraOgMed
                    ) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                tilOgMed: forrigeDag(fraOgMed),
                            },
                        };
                    }
                    if (index === oppdatertIndex) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                fraOgMed,
                            },
                        };
                    }
                    return barnetillegg;
                }),
            };
        }

        case 'oppdaterBarnetilleggTilOgMed': {
            const { index: oppdatertIndex, tilOgMed } = payload;
            const forrigePeriode = state.barnetilleggPerioder[oppdatertIndex]?.periode ?? null;

            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((barnetillegg, index) => {
                    if (index === oppdatertIndex) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                tilOgMed,
                            },
                        };
                    }
                    if (
                        index === oppdatertIndex + 1 &&
                        tilOgMed &&
                        forrigePeriode?.tilOgMed &&
                        tilOgMed > forrigePeriode.tilOgMed
                    ) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                fraOgMed: nesteDag(tilOgMed),
                            },
                        };
                    }
                    return barnetillegg;
                }),
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, BarnetilleggActions>;
