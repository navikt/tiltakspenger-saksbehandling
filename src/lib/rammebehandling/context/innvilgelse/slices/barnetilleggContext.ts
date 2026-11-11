import { InnvilgelseMedPerioderState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Periode } from '~/types/Periode';
import {
    oppdaterPeriode,
    oppdaterPeriodiseringUtenOverlapp,
    periodiseringTotalPeriode,
} from '~/utils/periode';
import { datoMin, nesteDag } from '~/utils/date';
import {
    BarnetilleggBarnSkjema,
    erSammeBarn,
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
          payload: { key: string; index: number; periodeOppdatering: Partial<Periode> };
      }
    | {
          type: 'leggTilBarnetilleggBarnPeriode';
          payload: { key: string };
      }
    | {
          type: 'fjernBarnetilleggBarnPeriode';
          payload: { key: string; index: number };
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
                perioder: heleInnvilgelsesperioden ? null : [standardPeriode(state, barn)],
            }));
        }

        case 'oppdaterBarnetilleggBarnPeriode': {
            const { key, index, periodeOppdatering } = payload;

            return oppdaterValgtBarn(state, key, (barn) => {
                const perioder = barn.perioder ?? [standardPeriode(state, barn)];
                const periode = oppdaterPeriode(perioder.atNonNull(index), periodeOppdatering);

                return {
                    ...barn,
                    perioder: oppdaterPerioderUtenOverlapp(perioder, periode, index),
                };
            });
        }

        case 'leggTilBarnetilleggBarnPeriode': {
            const { key } = payload;

            return oppdaterValgtBarn(state, key, (barn) => {
                const { tilOgMed } = standardPeriode(state, barn);
                const perioder = barn.perioder ?? [standardPeriode(state, barn)];
                const nyPeriode = {
                    fraOgMed: datoMin(nesteDag(perioder.atNonNull(-1).tilOgMed), tilOgMed),
                    tilOgMed,
                };

                return {
                    ...barn,
                    perioder: oppdaterPerioderUtenOverlapp(perioder, nyPeriode, perioder.length),
                };
            });
        }

        case 'fjernBarnetilleggBarnPeriode': {
            const { key, index } = payload;

            return oppdaterValgtBarn(state, key, (barn) => {
                if (!barn.perioder || barn.perioder.length <= 1) {
                    throw Error('Barnet må ha minst én valgt periode');
                }

                return { ...barn, perioder: barn.perioder.toSpliced(index, 1) };
            });
        }

        case 'leggTilManueltBarnetilleggBarn': {
            const { barn } = payload;

            if (
                state.manueltLagtTilBarn.some((it) => erSammeBarn(it, barn)) ||
                state.valgteBarn.some((it) => erSammeBarn(it, barn))
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

// Endrer eller legger til perioden på index, og justerer de andre periodene slik at de ikke overlapper, som for innvilgelsesperiodene
const oppdaterPerioderUtenOverlapp = (
    perioder: Periode[],
    periode: Periode,
    index: number,
): Periode[] =>
    oppdaterPeriodiseringUtenOverlapp(
        perioder.map((it) => ({ periode: it })),
        { periode },
        index,
    ).map((it) => it.periode);

// Perioden barnet har rett innenfor innvilgelsen, eller hele innvilgelsen dersom barnet ikke har rett i den
const standardPeriode = (
    state: InnvilgelseMedPerioderState,
    barn: BarnetilleggBarnSkjema,
): Periode =>
    gyldigPeriodeForBarn(
        barn,
        state.innvilgelsesperioder.map((it) => it.periode),
    ) ?? periodiseringTotalPeriode(state.innvilgelsesperioder);
