import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakBarnetilleggPeriode,
    VedtakInnvilgetResultat,
    VedtakResultat,
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
      };

export type FørstegangsVedtakSkjemaState = {
    resultat?: VedtakResultat;
    innvilgelsesPeriode: Periode;
    harBarnetillegg: boolean;
    barnetilleggPerioder: VedtakBarnetilleggPeriode[];
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
            const forrigePeriode = state.barnetilleggPerioder?.slice(-1)[0];

            const nestePeriode: Periode = forrigePeriode
                ? {
                      fraOgMed: leggTilDager(forrigePeriode.periode.tilOgMed, 1),
                      tilOgMed: leggTilDager(forrigePeriode.periode.tilOgMed, 30),
                  }
                : payload.tiltaksperiode;

            const nyBarnetilleggperiode: VedtakBarnetilleggPeriode = {
                antallBarn: forrigePeriode?.antallBarn ?? 0,
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
    }

    console.error(`Ugyldig action for førstegangsvedtak: "${type satisfies never}"`);
    return state;
};
