import { Periode } from '~/types/Periode';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { leggTilDager } from '~/utils/date';
import { ReducerActionHandlers } from '~/types/Context';

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

export const getTiltaksdeltagelseActionHandlers = <
    State extends TiltaksdeltagelseState,
>(): ReducerActionHandlers<State, TiltaksdeltagelseActions> =>
    ({
        addTiltakPeriode: (state: State, payload) => {
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
        },

        fjernTiltakPeriode: (state: State, payload) => {
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.filter(
                    (_, index) => index !== payload.fjernIndex,
                ),
            };
        },

        oppdaterTiltakId: (state, payload) => {
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.map((periode, index) =>
                    index === payload.index
                        ? { ...periode, eksternDeltagelseId: payload.eksternDeltagelseId }
                        : periode,
                ),
            };
        },

        oppdaterTiltakPeriode: (state, payload) => {
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
        },
    }) as const;
