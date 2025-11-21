import { Periode, PeriodeMedNullable } from '~/types/Periode';
import { leggTilDager } from '~/utils/date';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';

export type TiltaksdeltakelsePeriodeFormData = {
    eksternDeltagelseId: string;
    periode: PeriodeMedNullable;
};

export type TiltaksdeltagelseActions =
    | {
          type: 'addTiltakPeriode';
          payload?: undefined;
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

export const tiltaksdeltagelseReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: TiltaksdeltagelseActions,
): State => {
    const { type, payload } = action;

    switch (type) {
        case 'addTiltakPeriode': {
            const innvilgelsesperiode = state.innvilgelsesperiode as Periode;
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
                eksternDeltagelseId: forrigeTiltakPeriode?.eksternDeltagelseId,
                periode: nesteTiltakPeriode,
            };

            return {
                ...state,
                valgteTiltaksdeltakelser: [
                    ...(state.valgteTiltaksdeltakelser || []),
                    nyTiltakPeriode,
                ],
            };
        }

        case 'fjernTiltakPeriode': {
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.toSpliced(
                    payload.index,
                    1,
                ),
            };
        }

        case 'oppdaterTiltakId': {
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.map((periode, index) =>
                    index === payload.index
                        ? { ...periode, eksternDeltagelseId: payload.eksternDeltagelseId }
                        : periode,
                ),
            };
        }

        case 'oppdaterTiltaksdeltagelseFraOgMed': {
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
        }

        case 'oppdaterTiltaksdeltagelseTilOgMed': {
            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.map((periode, index) =>
                    index === payload.index
                        ? {
                              ...periode,
                              periode: { ...periode.periode, tilOgMed: payload.tilOgMed },
                          }
                        : periode,
                ),
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseState, TiltaksdeltagelseActions>;
