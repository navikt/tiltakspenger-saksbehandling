import { Periode } from '~/types/Periode';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { leggTilDager } from '~/utils/date';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';

export type TiltaksdeltagelseState = {
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
};

export type TiltaksdeltagelseActions =
    | {
          type: 'addTiltakPeriode';
      }
    | {
          type: 'fjernTiltakPeriode';
          payload: { index: number };
      }
    | {
          type: 'oppdaterTiltakId';
          payload: { eksternDeltagelseId: string; index: number };
      }
    | {
          type: 'oppdaterTiltakPeriode';
          payload: { periode: Partial<Periode>; index: number };
      };

export const tiltaksdeltagelseActionHandlers = {
    addTiltakPeriode: (state) => {
        const innvilgelsesperiode = state.behandlingsperiode as Periode;
        const forrigeTiltakPeriode = state.valgteTiltaksdeltakelser.slice(-1)[0];

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
            valgteTiltaksdeltakelser: [...(state.valgteTiltaksdeltakelser || []), nyTiltakPeriode],
        };
    },

    fjernTiltakPeriode: (state, payload) => {
        return {
            ...state,
            valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.toSpliced(payload.index, 1),
        };
    },

    oppdaterTiltakId: (state, payload) => {
        return {
            ...state,
            valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.map((periode, index) =>
                index === payload.index
                    ? { ...periode, eksternDeltagelseId: payload.eksternDeltagelseId }
                    : periode,
            ),
        };
    },

    oppdaterTiltakPeriode: (state, payload) => {
        return {
            ...state,
            valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.map((periode, index) =>
                index === payload.index
                    ? {
                          ...periode,
                          periode: { ...periode.periode, ...payload.periode },
                      }
                    : periode,
            ),
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<TiltaksdeltagelseActions>;
