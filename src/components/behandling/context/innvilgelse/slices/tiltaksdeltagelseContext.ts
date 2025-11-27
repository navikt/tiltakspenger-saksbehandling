import { datoMin, nesteDag } from '~/utils/date';
import { BehandlingInnvilgelseSteg2State } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { Reducer } from 'react';
import { oppdaterPeriodiseringUtenOverlapp } from '~/components/behandling/context/behandlingSkjemaUtils';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';

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

export const tiltaksdeltagelseReducer = (<State extends BehandlingInnvilgelseSteg2State>(
    state: State,
    action: TiltaksdeltagelseActions,
): State => {
    const { type, payload } = action;

    switch (type) {
        case 'addTiltakPeriode': {
            const innvilgelsesperiode = state.innvilgelsesperiode;
            const forrigeTiltakPeriode = state.valgteTiltaksdeltakelser.at(-1);

            if (!forrigeTiltakPeriode) {
                throw Error(
                    'Det skal alltid være minst en tiltaksdeltagelse valgt ved innvilgelse',
                );
            }

            const nyTiltakPeriode: TiltaksdeltakelsePeriode = {
                eksternDeltagelseId: forrigeTiltakPeriode.eksternDeltagelseId,
                periode: {
                    fraOgMed: datoMin(
                        nesteDag(forrigeTiltakPeriode.periode.tilOgMed),
                        innvilgelsesperiode.tilOgMed,
                    ),
                    tilOgMed: innvilgelsesperiode.tilOgMed,
                },
            };

            return {
                ...state,
                valgteTiltaksdeltakelser: oppdaterPeriodiseringUtenOverlapp(
                    state.valgteTiltaksdeltakelser,
                    nyTiltakPeriode,
                    state.valgteTiltaksdeltakelser.length,
                ),
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
            const { index, eksternDeltagelseId } = payload;

            const tiltakPeriode = state.valgteTiltaksdeltakelser.at(index);

            if (!tiltakPeriode) {
                return state;
            }

            return {
                ...state,
                valgteTiltaksdeltakelser: state.valgteTiltaksdeltakelser.with(index, {
                    ...tiltakPeriode,
                    eksternDeltagelseId,
                }),
            };
        }

        case 'oppdaterTiltaksdeltagelseFraOgMed': {
            const { index, fraOgMed } = payload;

            const tiltakPeriode = state.valgteTiltaksdeltakelser.at(index);

            if (!tiltakPeriode) {
                return state;
            }

            return {
                ...state,
                valgteTiltaksdeltakelser: oppdaterPeriodiseringUtenOverlapp(
                    state.valgteTiltaksdeltakelser,
                    {
                        ...tiltakPeriode,
                        periode: { ...tiltakPeriode.periode, fraOgMed },
                    },
                    index,
                ),
            };
        }

        case 'oppdaterTiltaksdeltagelseTilOgMed': {
            const { index, tilOgMed } = payload;

            const tiltakPeriode = state.valgteTiltaksdeltakelser.at(index);

            if (!tiltakPeriode) {
                return state;
            }

            return {
                ...state,
                valgteTiltaksdeltakelser: oppdaterPeriodiseringUtenOverlapp(
                    state.valgteTiltaksdeltakelser,
                    {
                        ...tiltakPeriode,
                        periode: { ...tiltakPeriode.periode, tilOgMed },
                    },
                    index,
                ),
            };
        }
    }
}) satisfies Reducer<BehandlingInnvilgelseSteg2State, TiltaksdeltagelseActions>;
