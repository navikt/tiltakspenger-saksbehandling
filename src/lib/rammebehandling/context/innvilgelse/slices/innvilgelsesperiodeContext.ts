import { Periode } from '~/types/Periode';
import {
    erFullstendigPeriode,
    oppdaterPartialPeriode,
    oppdaterPeriode,
    oppdaterPeriodiseringUtenOverlapp,
} from '~/utils/periode';
import { InnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { lagForhåndsutfyltInnvilgelse } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { datoMin, nesteDag } from '~/utils/date';
import { tilpassBarnTilInnvilgelsesperiodene } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { hentTotalInnvilgbarPeriode } from '~/lib/rammebehandling/rammebehandlingUtils';
import { nonNullish } from '~/utils/object';

export type InnvilgelsesperioderActions =
    | {
          type: 'oppdaterInnvilgelsesperiode';
          payload: {
              periodeOppdatering: Partial<Periode>;
              index: number;
              behandling: Rammebehandling;
          };
      }
    | {
          type: 'settAntallDager';
          payload: {
              antallDager: number;
              index: number;
          };
      }
    | {
          type: 'settTiltaksdeltakelse';
          payload: {
              internDeltakelseId: string;
              erReversertOpphør: boolean;
              index: number;
          };
      }
    | {
          type: 'leggTilInnvilgelsesperiode';
          payload: {
              behandling: Rammebehandling;
          };
      }
    | {
          type: 'fjernInnvilgelsesperiode';
          payload: {
              index: number;
              behandling: Rammebehandling;
          };
      };

export const innvilgelsesperioderReducer: Reducer<InnvilgelseState, InnvilgelsesperioderActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    const { harValgtPeriode } = state;

    if (!harValgtPeriode) {
        if (type !== 'oppdaterInnvilgelsesperiode') {
            throw Error(
                'Første innvilgelsesperiode må være fullstendig utfylt før andre handlinger kan utføres',
            );
        }

        const innvilgelsesperiode = nonNullish(
            state.innvilgelsesperioder.at(0),
            'Innvilgelsesperiode mangler',
        );

        const { periodeOppdatering, behandling } = payload;

        const nyPeriode = oppdaterPartialPeriode(innvilgelsesperiode.periode, periodeOppdatering);

        if (erFullstendigPeriode(nyPeriode)) {
            return lagForhåndsutfyltInnvilgelse(behandling, nyPeriode);
        }

        return {
            harValgtPeriode: false,
            innvilgelsesperioder: [
                {
                    ...innvilgelsesperiode,
                    periode: nyPeriode,
                },
            ],
        };
    }

    switch (type) {
        case 'oppdaterInnvilgelsesperiode': {
            const { periodeOppdatering, index } = payload;

            const innvilgelsesperiode = nonNullish(
                state.innvilgelsesperioder.at(index),
                `Fant ikke innvilgelsesperiode med index ${index}`,
            );

            const nyInnvilgelsesperiode = {
                ...innvilgelsesperiode,
                periode: oppdaterPeriode(innvilgelsesperiode.periode, periodeOppdatering),
            };

            const nyePerioder = oppdaterPeriodiseringUtenOverlapp(
                state.innvilgelsesperioder,
                nyInnvilgelsesperiode,
                index,
            );

            return {
                ...state,
                innvilgelsesperioder: nyePerioder,
                valgteBarn: tilpassBarnTilInnvilgelsesperiodene(state.valgteBarn, nyePerioder),
            };
        }

        case 'leggTilInnvilgelsesperiode': {
            const sisteInnvilgelsesperiode = nonNullish(
                state.innvilgelsesperioder.at(-1),
                'Skal alltid finnes minst en innvilgelsesperiode',
            );

            const { behandling } = payload;

            const sistePeriode = sisteInnvilgelsesperiode.periode;

            const totalInnvilgbarPeriode = nonNullish(hentTotalInnvilgbarPeriode(behandling));

            const nyTilOgMed = totalInnvilgbarPeriode.tilOgMed;

            const nyInnvilgelsesperiode = {
                ...sisteInnvilgelsesperiode,
                periode: {
                    fraOgMed: datoMin(nesteDag(sistePeriode.tilOgMed), nyTilOgMed),
                    tilOgMed: nyTilOgMed,
                },
            };

            const nyeInnvilgelsesperioder = oppdaterPeriodiseringUtenOverlapp(
                state.innvilgelsesperioder,
                nyInnvilgelsesperiode,
                state.innvilgelsesperioder.length,
            );

            return {
                ...state,
                innvilgelsesperioder: nyeInnvilgelsesperioder,
                valgteBarn: tilpassBarnTilInnvilgelsesperiodene(
                    state.valgteBarn,
                    nyeInnvilgelsesperioder,
                ),
            };
        }

        case 'fjernInnvilgelsesperiode': {
            const { index } = payload;

            const nyeInnvilgelsesperioder = state.innvilgelsesperioder.toSpliced(index, 1);

            return {
                ...state,
                innvilgelsesperioder: nyeInnvilgelsesperioder,
                valgteBarn: tilpassBarnTilInnvilgelsesperiodene(
                    state.valgteBarn,
                    nyeInnvilgelsesperioder,
                ),
            };
        }

        case 'settAntallDager': {
            const { index, antallDager } = payload;

            const innvilgelsesperiode = state.innvilgelsesperioder.atNonNull(index);

            return {
                ...state,
                innvilgelsesperioder: state.innvilgelsesperioder.with(index, {
                    ...innvilgelsesperiode,
                    antallDagerPerMeldeperiode: antallDager,
                }),
            };
        }

        case 'settTiltaksdeltakelse': {
            const { index, internDeltakelseId, erReversertOpphør } = payload;

            const innvilgelsesperiode = state.innvilgelsesperioder.atNonNull(index);

            return {
                ...state,
                innvilgelsesperioder: state.innvilgelsesperioder.with(index, {
                    ...innvilgelsesperiode,
                    internDeltakelseId: internDeltakelseId,
                    erReversertOpphør,
                }),
            };
        }
    }

    throw new Error(`Ugyldig action: ${type satisfies never}`);
};
