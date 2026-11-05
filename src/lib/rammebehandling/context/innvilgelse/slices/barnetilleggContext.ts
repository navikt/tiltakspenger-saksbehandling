import { InnvilgelseMedPerioderState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Periode } from '~/types/Periode';
import { oppdaterPeriode, periodiseringTotalPeriode } from '~/utils/periode';
import {
    BarnetilleggBarnSkjema,
    gyldigPeriodeForBarn,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';

export type BarnetilleggActions =
    | {
          type: 'setHarSøktBarnetillegg';
          payload: { harSøkt: boolean };
      }
    | {
          type: 'velgBarnetilleggBarn';
          payload: { barn: BarnetilleggBarnSkjema; valgt: boolean };
      }
    | {
          type: 'settValgteBarnetilleggBarn';
          payload: { barn: BarnetilleggBarnSkjema[] };
      }
    | {
          type: 'settBarnetilleggPeriodevalg';
          payload: { key: string; heleInnvilgelsesperioden: boolean };
      }
    | {
          type: 'oppdaterBarnetilleggBarnPeriode';
          payload: { key: string; periodeOppdatering: Partial<Periode> };
      }
    | {
          type: 'leggTilManueltBarnetilleggBarn';
          payload: { barn: BarnetilleggBarnSkjema };
      }
    | {
          type: 'fjernManueltBarnetilleggBarn';
          payload: { key: string };
      };

export const barnetilleggReducer: Reducer<InnvilgelseMedPerioderState, BarnetilleggActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    switch (type) {
        case 'setHarSøktBarnetillegg': {
            return { ...state, harBarnetillegg: payload.harSøkt };
        }

        case 'velgBarnetilleggBarn': {
            const { barn, valgt } = payload;
            const utenBarnet = state.valgteBarn.filter((it) => it.key !== barn.key);

            return { ...state, valgteBarn: valgt ? [...utenBarnet, barn] : utenBarnet };
        }

        case 'settValgteBarnetilleggBarn': {
            return {
                ...state,
                valgteBarn: payload.barn,
                harBarnetillegg: payload.barn.length > 0,
            };
        }

        case 'settBarnetilleggPeriodevalg': {
            const { key, heleInnvilgelsesperioden } = payload;

            return oppdaterValgtBarn(state, key, (barn) => ({
                ...barn,
                periode: heleInnvilgelsesperioden ? null : standardPeriode(state, barn),
            }));
        }

        case 'oppdaterBarnetilleggBarnPeriode': {
            const { key, periodeOppdatering } = payload;

            return oppdaterValgtBarn(state, key, (barn) => ({
                ...barn,
                periode: oppdaterPeriode(
                    barn.periode ?? standardPeriode(state, barn),
                    periodeOppdatering,
                ),
            }));
        }

        case 'leggTilManueltBarnetilleggBarn': {
            const { barn } = payload;

            if (
                state.manueltLagtTilBarn.some((it) => it.key === barn.key) ||
                state.valgteBarn.some((it) => it.key === barn.key)
            ) {
                throw Error('Barnet er allerede lagt til');
            }

            return {
                ...state,
                manueltLagtTilBarn: [...state.manueltLagtTilBarn, barn],
                valgteBarn: [...state.valgteBarn, barn],
            };
        }

        case 'fjernManueltBarnetilleggBarn': {
            const { key } = payload;

            return {
                ...state,
                manueltLagtTilBarn: state.manueltLagtTilBarn.filter((it) => it.key !== key),
                valgteBarn: state.valgteBarn.filter((it) => it.key !== key),
            };
        }
    }
};

const oppdaterValgtBarn = (
    state: InnvilgelseMedPerioderState,
    key: string,
    oppdater: (barn: BarnetilleggBarnSkjema) => BarnetilleggBarnSkjema,
): InnvilgelseMedPerioderState => {
    const index = state.valgteBarn.findIndex((it) => it.key === key);

    if (index === -1) {
        throw Error(`Fant ikke valgt barn med key ${key}`);
    }

    return {
        ...state,
        valgteBarn: state.valgteBarn.with(index, oppdater(state.valgteBarn.atNonNull(index))),
    };
};

// Perioden barnet har rett innenfor innvilgelsen, eller hele innvilgelsen dersom barnet ikke har rett i den
const standardPeriode = (
    state: InnvilgelseMedPerioderState,
    barn: BarnetilleggBarnSkjema,
): Periode =>
    gyldigPeriodeForBarn(
        barn,
        state.innvilgelsesperioder.map((it) => it.periode),
    ) ?? periodiseringTotalPeriode(state.innvilgelsesperioder);
