import { Periode } from '~/types/Periode';
import { VedtakBarnetilleggPeriode } from '~/types/VedtakTyper';
import { forrigeDag, nesteDag } from '~/utils/date';
import { ReducerActionHandlers } from '~/types/Context';
import { SøknadForBehandlingProps } from '~/types/SøknadTypes';
import { periodiserBarnetillegg } from '~/utils/barnetillegg';

export type BarnetilleggState = {
    harBarnetillegg: boolean;
    barnetilleggPerioder: VedtakBarnetilleggPeriode[];
};

export type BarnetilleggActions =
    | {
          type: 'setHarSøktBarnetillegg';
          payload: { harSøkt: boolean };
      }
    | {
          type: 'addBarnetilleggPeriode';
          payload: { innvilgelsesPeriode: Periode; antallBarnFraSøknad: number };
      }
    | {
          type: 'fjernBarnetilleggPeriode';
          payload: { fjernIndex: number };
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
          type: 'nullstillBarnetilleggPerioder';
          payload: { innvilgelsesPeriode: Periode; søknad: SøknadForBehandlingProps };
      };

export const getBarnetilleggActionHandlers = <
    State extends BarnetilleggState,
>(): ReducerActionHandlers<State, BarnetilleggActions> =>
    ({
        setHarSøktBarnetillegg: (state, payload) => {
            return { ...state, harBarnetillegg: payload.harSøkt };
        },

        addBarnetilleggPeriode: (state, payload) => {
            const { innvilgelsesPeriode, antallBarnFraSøknad } = payload;
            const forrigeBarnetillegg = state.barnetilleggPerioder?.at(-1);

            const nestePeriode: Periode = forrigeBarnetillegg
                ? {
                      fraOgMed:
                          innvilgelsesPeriode.tilOgMed > forrigeBarnetillegg.periode.tilOgMed
                              ? nesteDag(forrigeBarnetillegg.periode.tilOgMed)
                              : innvilgelsesPeriode.tilOgMed,
                      tilOgMed: innvilgelsesPeriode.tilOgMed,
                  }
                : innvilgelsesPeriode;

            const nyBarnetilleggperiode: VedtakBarnetilleggPeriode = {
                // Antall barn må alltid være >=1
                antallBarn: forrigeBarnetillegg?.antallBarn || antallBarnFraSøknad || 1,
                periode: nestePeriode,
            };

            return {
                ...state,
                barnetilleggPerioder: [
                    ...(state.barnetilleggPerioder || []),
                    nyBarnetilleggperiode,
                ],
            };
        },

        fjernBarnetilleggPeriode: (state, payload) => {
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.filter(
                    (_, index) => index !== payload.fjernIndex,
                ),
            };
        },

        nullstillBarnetilleggPerioder: (state, payload) => {
            return {
                ...state,
                barnetilleggPerioder: periodiserBarnetillegg(
                    payload.søknad.barnetillegg,
                    payload.innvilgelsesPeriode,
                ),
            };
        },

        oppdaterBarnetilleggAntall: (state, payload) => {
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((periode, index) =>
                    index === payload.index ? { ...periode, antallBarn: payload.antall } : periode,
                ),
            };
        },

        oppdaterBarnetilleggPeriode: (state, payload) => {
            const { index: oppdatertIndex, periode: oppdatertPeriode } = payload;

            const forrigePeriode = state.barnetilleggPerioder[oppdatertIndex].periode;

            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((barnetillegg, index) => {
                    if (
                        index === oppdatertIndex - 1 &&
                        oppdatertPeriode.fraOgMed &&
                        oppdatertPeriode.fraOgMed < forrigePeriode.fraOgMed
                    ) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                tilOgMed: forrigeDag(oppdatertPeriode.fraOgMed),
                            },
                        };
                    }

                    if (index === oppdatertIndex) {
                        return {
                            ...barnetillegg,
                            periode: { ...barnetillegg.periode, ...oppdatertPeriode },
                        };
                    }

                    if (
                        index === oppdatertIndex + 1 &&
                        oppdatertPeriode.tilOgMed &&
                        oppdatertPeriode.tilOgMed > forrigePeriode.tilOgMed
                    ) {
                        return {
                            ...barnetillegg,
                            periode: {
                                ...barnetillegg.periode,
                                fraOgMed: nesteDag(oppdatertPeriode.tilOgMed),
                            },
                        };
                    }

                    return barnetillegg;
                }),
            };
        },
    }) as const;
