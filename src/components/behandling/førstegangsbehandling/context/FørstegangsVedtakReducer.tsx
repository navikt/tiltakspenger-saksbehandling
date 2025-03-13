import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakBarnetilleggPeriode,
    VedtakInnvilgetResultat,
    VedtakResultat,
    VedtakTiltaksdeltakelsePeriode,
} from '../../../../types/VedtakTyper';
import { Periode } from '../../../../types/Periode';
import { leggTilDager } from '../../../../utils/date';

export type FørstegangsVedtakSkjemaActions =
    | {
          type: 'setResultat';
          payload: { resultat: VedtakInnvilgetResultat | VedtakAvslagResultat };
      }
    | {
          type: 'setHarSøktBarnetillegg';
          payload: { harSøkt: boolean };
      }
    | {
          type: 'addBarnetilleggPeriode';
          payload: { innvilgelsesPeriode: Periode };
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
          type: 'oppdaterInnvilgetPeriode';
          payload: { periode: Partial<Periode> };
      }
    | {
          type: 'addTiltakPeriode';
          payload: { periode: Periode };
      }
    | {
          type: 'fjernTiltakPeriode';
          payload: { fjernIndex: number };
      }
    | {
          type: 'oppdaterTiltakId';
          payload: { eksternDeltagelseId: string; index: number };
      }
    | {
          type: 'oppdaterTiltakPeriode';
          payload: { periode: Partial<Periode>; index: number };
      };

export type FørstegangsVedtakSkjemaState = {
    resultat?: VedtakResultat;
    innvilgelsesPeriode: Periode;
    harBarnetillegg: boolean;
    barnetilleggPerioder: VedtakBarnetilleggPeriode[];
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
};

export const førstegangsVedtakReducer: Reducer<
    FørstegangsVedtakSkjemaState,
    FørstegangsVedtakSkjemaActions
> = (state, action): FørstegangsVedtakSkjemaState => {
    const { type, payload } = action;

    switch (type) {
        case 'oppdaterInnvilgetPeriode':
            return {
                ...state,
                innvilgelsesPeriode: { ...state.innvilgelsesPeriode, ...payload.periode },
            };
        case 'setResultat':
            return { ...state, ...payload.resultat };
        case 'setHarSøktBarnetillegg':
            return { ...state, harBarnetillegg: payload.harSøkt };
        case 'addBarnetilleggPeriode':
            const { innvilgelsesPeriode } = payload;
            const forrigeBarnetillegg = state.barnetilleggPerioder?.slice(-1)[0];

            const nestePeriode: Periode = forrigeBarnetillegg
                ? {
                      fraOgMed:
                          innvilgelsesPeriode.tilOgMed > forrigeBarnetillegg.periode.tilOgMed
                              ? leggTilDager(forrigeBarnetillegg.periode.tilOgMed, 1)
                              : innvilgelsesPeriode.tilOgMed,
                      tilOgMed: innvilgelsesPeriode.tilOgMed,
                  }
                : innvilgelsesPeriode;

            const nyBarnetilleggperiode: VedtakBarnetilleggPeriode = {
                antallBarn: forrigeBarnetillegg?.antallBarn ?? 0,
                periode: nestePeriode,
            };

            return {
                ...state,
                barnetilleggPerioder: [
                    ...(state.barnetilleggPerioder || []),
                    nyBarnetilleggperiode,
                ],
            };
        case 'fjernBarnetilleggPeriode':
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.filter(
                    (_, index) => index !== payload.fjernIndex,
                ),
            };
        case 'oppdaterBarnetilleggAntall':
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder.map((periode, index) =>
                    index === payload.index ? { ...periode, antallBarn: payload.antall } : periode,
                ),
            };
        case 'oppdaterBarnetilleggPeriode':
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
                                tilOgMed: leggTilDager(oppdatertPeriode.fraOgMed, -1),
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
                                fraOgMed: leggTilDager(oppdatertPeriode.tilOgMed, 1),
                            },
                        };
                    }

                    return barnetillegg;
                }),
            };
        case 'addTiltakPeriode':
            const forrigeTiltakPeriode = state.valgteTiltaksdeltakelser?.slice(-1)[0];

            const nesteTiltakPeriode: Periode = forrigeTiltakPeriode
                ? {
                      fraOgMed: leggTilDager(forrigeTiltakPeriode.periode.tilOgMed, 1),
                      tilOgMed: leggTilDager(forrigeTiltakPeriode.periode.tilOgMed, 30),
                  }
                : payload.periode;

            const nyTiltakPeriode: VedtakTiltaksdeltakelsePeriode = {
                eksternDeltagelseId: forrigeTiltakPeriode.eksternDeltagelseId,
                periode: nesteTiltakPeriode,
            };

            return {
                ...state,
                valgteTiltaksdeltakelser: [
                    ...(state.valgteTiltaksdeltakelser || []),
                    nyTiltakPeriode,
                ],
            };
        case 'fjernTiltakPeriode':
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.filter(
                    (_, index) => index !== payload.fjernIndex,
                ),
            };
        case 'oppdaterTiltakId':
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.map((periode, index) =>
                    index === payload.index
                        ? { ...periode, eksternDeltagelseId: payload.eksternDeltagelseId }
                        : periode,
                ),
            };
        case 'oppdaterTiltakPeriode':
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.map((periode, index) =>
                    index === payload.index
                        ? {
                              ...periode,
                              periode: { ...periode.periode, ...payload.periode },
                          }
                        : periode,
                ),
            };
    }

    console.error(`Ugyldig action for førstegangsvedtak: "${type satisfies never}"`);
    return state;
};
