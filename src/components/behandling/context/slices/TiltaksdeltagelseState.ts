import { Periode, PeriodeMedNullable } from '~/types/Periode';
import { leggTilDager } from '~/utils/date';
import { BehandlingSkjemaActionHandlers } from '~/components/behandling/context/BehandlingSkjemaReducer';

export type TiltaksdeltagelseState = {
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriodeFormData[];
};

export type TiltaksdeltakelsePeriodeFormData = {
    eksternDeltagelseId: string;
    periode: PeriodeMedNullable;
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
          type: 'oppdaterTiltaksdeltagelseFraOgMed';
          payload: { fraOgMed: string; index: number };
      }
    | {
          type: 'oppdaterTiltaksdeltagelseTilOgMed';
          payload: { tilOgMed: string; index: number };
      };

export const tiltaksdeltagelseActionHandlers = {
    addTiltakPeriode: (state) => {
        const innvilgelsesperiode = state.behandlingsperiode as Periode;
        const forrigeTiltakPeriode = state.valgteTiltaksdeltakelser.slice(-1)[0];

        const nesteTiltakPeriode = forrigeTiltakPeriode
            ? {
                  fraOgMed: forrigeTiltakPeriode.periode.tilOgMed
                      ? leggTilDager(forrigeTiltakPeriode.periode.tilOgMed, 1)
                      : innvilgelsesperiode.fraOgMed,
                  tilOgMed: innvilgelsesperiode.tilOgMed,
              }
            : innvilgelsesperiode;

        const nyTiltakPeriode: TiltaksdeltakelsePeriodeFormData = {
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
    oppdaterTiltaksdeltagelseFraOgMed: (state, payload) => {
        return {
            ...state,
            valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.map((periode, index) =>
                index === payload.index
                    ? {
                          ...periode,
                          periode: { ...periode.periode, fraOgMed: payload.fraOgMed },
                      }
                    : periode,
            ),
        };
    },
    oppdaterTiltaksdeltagelseTilOgMed: (state, payload) => {
        return {
            ...state,
            valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser?.map((periode, index) =>
                index === payload.index
                    ? {
                          ...periode,
                          periode: { ...periode.periode, tilOgMed: payload.tilOgMed },
                      }
                    : periode,
            ),
        };
    },
} as const satisfies BehandlingSkjemaActionHandlers<TiltaksdeltagelseActions>;
