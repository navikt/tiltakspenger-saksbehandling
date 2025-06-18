import { Periode } from '~/types/Periode';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { Reducer } from 'react';
import { leggTilDager } from '~/utils/date';

export type TiltaksdeltagelseState = {
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
};

export type TiltaksdeltagelseActions =
    | {
          type: 'addTiltakPeriode';
          payload: { innvilgelsesperiode: Periode };
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

export const TiltaksdeltagelseReducer: Reducer<TiltaksdeltagelseState, TiltaksdeltagelseActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'addTiltakPeriode':
            const { innvilgelsesperiode } = payload;
            const forrigeTiltakPeriode = state.valgteTiltaksdeltakelser?.slice(-1)[0];

            const nesteTiltakPeriode: Periode = forrigeTiltakPeriode
                ? {
                      fraOgMed:
                          innvilgelsesperiode.tilOgMed > forrigeTiltakPeriode.periode.tilOgMed
                              ? leggTilDager(forrigeTiltakPeriode.periode.tilOgMed, 1)
                              : innvilgelsesperiode.tilOgMed,
                      tilOgMed: innvilgelsesperiode.tilOgMed,
                  }
                : innvilgelsesperiode;

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

    console.error(`Ugyldig action for søknadsbehandling: "${type satisfies never}"`);
    return state;
};
//
// export const useTiltaksdeltagelseReducer = () => {
//     const [] = useReducer()
// }
