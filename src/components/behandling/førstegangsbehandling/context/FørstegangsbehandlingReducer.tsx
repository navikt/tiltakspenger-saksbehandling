import { Dispatch, Reducer, useReducer } from 'react';
import {
    VedtakAvslagResultat,
    VedtakData,
    VedtakInnvilgetResultat,
} from '../../../../types/VedtakTyper';
import { Periode } from '../../../../types/Periode';
import { hentTiltaksPeriode } from '../../../../utils/tiltak';
import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';

type FørstegangsbehandlingActions =
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

export type FørstegangsbehandlingDispatch = Dispatch<FørstegangsbehandlingActions>;

const reducer: Reducer<VedtakData, FørstegangsbehandlingActions> = (state, action) => {
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

const initiellVedtaksData = (behandling: FørstegangsbehandlingData): VedtakData => ({
    begrunnelseVilkårsvurdering: behandling.begrunnelseVilkårsvurdering ?? '',
    fritekstTilVedtaksbrev: behandling.fritekstTilVedtaksbrev ?? '',
    innvilgelsesPeriode: behandling.virkningsperiode ?? hentTiltaksPeriode(behandling),
    resultat: behandling.virkningsperiode ? 'innvilget' : undefined,
});

export const useFørstegangsbehandlingReducer = (behandling: FørstegangsbehandlingData) => {
    return useReducer(reducer, initiellVedtaksData(behandling));
};
