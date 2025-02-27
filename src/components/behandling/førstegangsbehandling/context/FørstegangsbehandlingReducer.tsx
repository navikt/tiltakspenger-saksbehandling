import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakBarnetilleggPeriode,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../../types/VedtakTyper';
import { Periode } from '../../../../types/Periode';
import { leggTilDager } from '../../../../utils/date';

export type FørstegangsbehandlingActions =
    | {
          type: 'setBegrunnelse';
          payload: { begrunnelse: string };
      }
    | {
          type: 'setBrevtekst';
          payload: { brevtekst: string };
      }
    | {
          type: 'setResultat';
          payload: { resultat: VedtakInnvilgetResultat | VedtakAvslagResultat };
      }
    | {
          type: 'setBarnetilleggBegrunnelse';
          payload: { begrunnelse: string };
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
        case 'setBegrunnelse':
            return {
                ...state,
                begrunnelseVilkårsvurdering: payload.begrunnelse,
            };
        case 'setBrevtekst':
            return { ...state, fritekstTilVedtaksbrev: payload.brevtekst };
        case 'setResultat':
            return { ...state, ...payload.resultat };
        case 'setBarnetilleggBegrunnelse':
            return {
                ...state,
                barnetillegg: {
                    ...state.barnetillegg,
                    begrunnelse: payload.begrunnelse,
                },
            };
        case 'addBarnetilleggPeriode':
            const forrigePeriode =
                state.barnetillegg?.barnetilleggForPeriode?.slice(-1)[0]?.periode;

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
                barnetillegg: {
                    ...state.barnetillegg,
                    barnetilleggForPeriode: [
                        ...(state.barnetillegg?.barnetilleggForPeriode || []),
                        nyBarnetilleggperiode,
                    ],
                },
            };
        case 'fjernBarnetilleggPeriode':
            return {
                ...state,
                barnetillegg: {
                    ...state.barnetillegg,
                    barnetilleggForPeriode: state.barnetillegg?.barnetilleggForPeriode?.filter(
                        (_, index) => index !== payload.fjernIndex,
                    ),
                },
            };
    }

    console.error(`Ugyldig action for førstegangsbehandlingsvedtak: "${type satisfies never}"`);
    return state;
};
