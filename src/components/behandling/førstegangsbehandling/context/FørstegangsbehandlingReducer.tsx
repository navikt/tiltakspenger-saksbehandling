import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakBarnetilleggPeriode,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../../types/VedtakTyper';
import { Periode } from '../../../../types/Periode';

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
          type: 'setBarnetilleggPerioder';
          payload: { perioder: VedtakBarnetilleggPeriode[] };
      }
    | {
          type: 'oppdaterInnvilgetPeriode';
          payload: { periode: Partial<Periode> };
      };

export const førstegangsVedtakReducer: Reducer<VedtakData, FørstegangsbehandlingActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'oppdaterInnvilgetPeriode':
            return {
                ...state,
                innvilgelsesPeriode: { ...state.innvilgelsesPeriode, ...payload.periode },
            };
        case 'setBegrunnelse':
            return { ...state, begrunnelseVilkårsvurdering: payload.begrunnelse };
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
        case 'setBarnetilleggPerioder':
            return {
                ...state,
                barnetillegg: {
                    ...state.barnetillegg,
                    barnetilleggForPeriode: payload.perioder,
                },
            };
    }

    console.error(`Ugyldig action for førstegangsbehandlingsvedtak: "${type satisfies never}"`);
    return state;
};
