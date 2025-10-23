import { Periode } from '~/types/Periode';

import { forrigeDag, nesteDag } from '~/utils/date';

import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { SøknadDTO } from '~/types/Søknad';
import { BarnetilleggPeriodeFormData } from '../../felles/barnetillegg/utils/hentBarnetilleggFraBehandling';

export type BarnetilleggState = {
    harBarnetillegg: boolean;
    barnetilleggPerioder: BarnetilleggPeriodeFormData[];
};

export type BarnetilleggActions =
    | {
          type: 'setHarSøktBarnetillegg';
          payload: { harSøkt: boolean };
      }
    | {
          type: 'addBarnetilleggPeriode';
          payload: { antallBarnFraSøknad: number };
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
          payload: { søknad: SøknadDTO };
      };

export const barnetilleggActionHandlers = {
    setHarSøktBarnetillegg: (state, payload) => {
        return { ...state, harBarnetillegg: payload.harSøkt };
    },

    addBarnetilleggPeriode: (state, payload) => {
        const { antallBarnFraSøknad } = payload;
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
            // Antall barn må alltid være >=1
            antallBarn: forrigeBarnetillegg?.antallBarn || antallBarnFraSøknad || 1,
            periode: nestePeriode,
        };

        return {
            ...state,
            barnetilleggPerioder: [...(state.barnetilleggPerioder || []), nyBarnetilleggperiode],
        };
    },

    fjernBarnetilleggPeriode: (state, payload) => {
        return {
            ...state,
            barnetilleggPerioder: state.barnetilleggPerioder.toSpliced(payload.index, 1),
        };
    },

    nullstillBarnetilleggPerioder: (state, payload) => {
        return {
            ...state,
            barnetilleggPerioder: periodiserBarnetilleggFraSøknad(
                payload.søknad.barnetillegg,
                state.behandlingsperiode as Periode,
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
    oppdaterBarnetilleggFraOgMed: (state, payload) => {
        const { index: oppdatertIndex, fraOgMed } = payload;
        const forrigePeriode = state.barnetilleggPerioder[oppdatertIndex]?.periode ?? null;

        return {
            ...state,
            barnetilleggPerioder: state.barnetilleggPerioder.map((barnetillegg, index) => {
                // Oppdater forrige periode sin slutt
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

                // Oppdater aktuell periode sin start
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
    },
    oppdaterBarnetilleggTilOgMed: (state, payload) => {
        const { index: oppdatertIndex, tilOgMed } = payload;
        const forrigePeriode = state.barnetilleggPerioder[oppdatertIndex]?.periode ?? null;

        return {
            ...state,
            barnetilleggPerioder: state.barnetilleggPerioder.map((barnetillegg, index) => {
                // Oppdater aktuell periode sin slutt
                if (index === oppdatertIndex) {
                    return {
                        ...barnetillegg,
                        periode: {
                            ...barnetillegg.periode,
                            tilOgMed,
                        },
                    };
                }

                // Oppdater neste periode sin start
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
    },
} as const satisfies BehandlingSkjemaActionHandlers<BarnetilleggActions>;
