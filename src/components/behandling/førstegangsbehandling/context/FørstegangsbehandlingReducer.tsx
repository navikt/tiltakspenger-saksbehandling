import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakBarnetilleggPeriode,
    VedtakInnvilgetResultat,
} from '../../../../types/VedtakTyper';
import { Periode } from '../../../../types/Periode';
import { leggTilDager } from '../../../../utils/date';
import { VedtakData } from './FørstegangsbehandlingContext';

export type FørstegangsbehandlingActions =
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

export const førstegangsVedtakReducer: Reducer<VedtakData, FørstegangsbehandlingActions> = (
    state,
    action,
): VedtakData => {
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
            const forrigePeriode = state.barnetilleggPerioder?.slice(-1)[0]?.periode;

            const nestePeriode: Periode = forrigePeriode
                ? {
                      fraOgMed: leggTilDager(forrigePeriode.tilOgMed, 1),
                      tilOgMed: leggTilDager(forrigePeriode.tilOgMed, 30),
                  }
                : payload.tiltaksperiode;

            const nyBarnetilleggperiode: VedtakBarnetilleggPeriode = {
                antallBarn: 0,
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

    console.error(`Ugyldig action for førstegangsbehandlingsvedtak: "${type satisfies never}"`);
    return state;
};
