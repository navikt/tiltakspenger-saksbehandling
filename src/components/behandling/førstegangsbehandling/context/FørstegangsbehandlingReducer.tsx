import { Reducer } from 'react';
import {
    VedtakAvslagResultat,
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
          type: 'setBarnetillegg';
          payload: { barnetillegg: unknown };
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
        case 'setBarnetillegg':
            return { ...state, barnetillegg: payload.barnetillegg };
    }

    console.error(`Ugyldig action for førstegangsbehandlingsvedtak: "${type}"`);
    return state;
};
