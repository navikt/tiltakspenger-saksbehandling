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
          payload: { tiltaksperiode: Periode };
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
            const { tiltaksperiode } = payload;
            const forrigeBarnetillegg = state.barnetilleggPerioder?.slice(-1)[0];

            const nestePeriode: Periode = forrigeBarnetillegg
                ? {
                      fraOgMed:
                          tiltaksperiode.tilOgMed > forrigeBarnetillegg.periode.tilOgMed
                              ? leggTilDager(forrigeBarnetillegg.periode.tilOgMed, 1)
                              : tiltaksperiode.tilOgMed,
                      tilOgMed: tiltaksperiode.tilOgMed,
                  }
                : tiltaksperiode;

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
                barnetilleggPerioder: state.barnetilleggPerioder?.filter(
                    (_, index) => index !== payload.fjernIndex,
                ),
            };
        case 'oppdaterBarnetilleggAntall':
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder?.map((periode, index) =>
                    index === payload.index ? { ...periode, antallBarn: payload.antall } : periode,
                ),
            };
        case 'oppdaterBarnetilleggPeriode':
            return {
                ...state,
                barnetilleggPerioder: state.barnetilleggPerioder?.map((periode, index) =>
                    index === payload.index
                        ? {
                              ...periode,
                              periode: { ...periode.periode, ...payload.periode },
                          }
                        : periode,
                ),
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
