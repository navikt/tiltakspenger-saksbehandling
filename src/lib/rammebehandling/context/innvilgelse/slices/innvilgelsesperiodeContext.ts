import { Periode } from '~/types/Periode';
import { oppdaterPeriode, oppdaterPeriodiseringUtenOverlapp } from '~/utils/periode';
import {
    InnvilgelseMedPerioderState,
    InnvilgelseState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Reducer } from 'react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    InnvilgelseForTiltak,
    InnvilgelsesperiodeForTiltak,
    Innvilgelsesperioder,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import {
    lagBarnetilleggSkjemaState,
    tilpassBarnTilInnvilgelsesperiodene,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { nonNullish } from '~/utils/object';
import {
    erSammeTiltak,
    hentTiltakSomKanVelges,
    lagInnvilgelseForTiltak,
    lagNyPeriodeForTiltak,
    sorterTiltak,
    TiltakNøkkel,
    tilpassAntallDager,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';

export type InnvilgelsesperioderActions =
    | {
          type: 'velgTiltak';
          payload: {
              tiltak: TiltakNøkkel;
              valgt: boolean;
              behandling: Rammebehandling;
              // Fra saken. Forhåndsutfylt antall dager er maks 10 når det ikke kan meldes for helg.
              kanSendeInnHelgForMeldekort: boolean;
              // Vedtaksperioden ved omgjøring. Reversert opphør kan bare velges innenfor den.
              vedtaksperiode?: Partial<Periode>;
              // Perioden et nytt valgt tiltak forhåndsutfylles innenfor
              avgrensning?: Periode;
          };
      }
    | {
          type: 'oppdaterTiltakPeriode';
          payload: {
              tiltak: TiltakNøkkel;
              index: number;
              periodeOppdatering: Partial<Periode>;
              behandling: Rammebehandling;
              // Fra saken. Forhåndsutfylt antall dager er maks 10 når det ikke kan meldes for helg.
              kanSendeInnHelgForMeldekort: boolean;
          };
      }
    | {
          type: 'settAntallDager';
          payload: {
              // Index for delperioden, se hentDelperioder
              index: number;
              antallDager: number;
          };
      }
    | {
          type: 'leggTilTiltakPeriode';
          payload: {
              tiltak: TiltakNøkkel;
              behandling: Rammebehandling;
              // Fra saken. Forhåndsutfylt antall dager er maks 10 når det ikke kan meldes for helg.
              kanSendeInnHelgForMeldekort: boolean;
              vedtaksperiode?: Partial<Periode>;
          };
      }
    | {
          type: 'fjernTiltakPeriode';
          payload: {
              tiltak: TiltakNøkkel;
              index: number;
              behandling: Rammebehandling;
              // Fra saken. Forhåndsutfylt antall dager er maks 10 når det ikke kan meldes for helg.
              kanSendeInnHelgForMeldekort: boolean;
          };
      };

export const innvilgelsesperioderReducer: Reducer<InnvilgelseState, InnvilgelsesperioderActions> = (
    state,
    action,
) => {
    const { type, payload } = action;

    if (type === 'velgTiltak') {
        return velgTiltak(state, payload);
    }

    if (!state.harValgtPeriode) {
        throw Error(`Et tiltak må være valgt før perioder kan endres (${type})`);
    }

    switch (type) {
        case 'oppdaterTiltakPeriode': {
            const { tiltak, index, periodeOppdatering, behandling, kanSendeInnHelgForMeldekort } =
                payload;

            return oppdaterPerioderForTiltak(
                state,
                tiltak,
                behandling,
                kanSendeInnHelgForMeldekort,
                (perioder) => {
                    const innvilgelsesperiode = nonNullish(
                        perioder.at(index),
                        `Fant ikke periode med index ${index}`,
                    );

                    return oppdaterPeriodiseringUtenOverlapp(
                        perioder,
                        {
                            ...innvilgelsesperiode,
                            periode: oppdaterPeriode(
                                innvilgelsesperiode.periode,
                                periodeOppdatering,
                            ),
                        },
                        index,
                    );
                },
            );
        }

        case 'settAntallDager': {
            const { index, antallDager } = payload;
            const { antallDagerPerMeldeperiode } = state.innvilgelsesperioder;

            return {
                ...state,
                innvilgelsesperioder: {
                    ...state.innvilgelsesperioder,
                    antallDagerPerMeldeperiode: antallDagerPerMeldeperiode.with(index, {
                        ...antallDagerPerMeldeperiode.atNonNull(index),
                        antallDagerPerMeldeperiode: antallDager,
                    }),
                },
            };
        }

        case 'leggTilTiltakPeriode': {
            const { tiltak, behandling, kanSendeInnHelgForMeldekort, vedtaksperiode } = payload;

            const innvilgbarePerioder =
                hentTiltakSomKanVelges(behandling, [tiltak], vedtaksperiode).find((it) =>
                    erSammeTiltak(it, tiltak),
                )?.innvilgbarePerioder ?? [];

            return oppdaterPerioderForTiltak(
                state,
                tiltak,
                behandling,
                kanSendeInnHelgForMeldekort,
                (perioder) => {
                    const nyPeriode = lagNyPeriodeForTiltak(perioder, innvilgbarePerioder);

                    return nyPeriode
                        ? oppdaterPeriodiseringUtenOverlapp(perioder, nyPeriode, perioder.length)
                        : perioder;
                },
            );
        }

        case 'fjernTiltakPeriode': {
            const { tiltak, index, behandling, kanSendeInnHelgForMeldekort } = payload;

            return oppdaterPerioderForTiltak(
                state,
                tiltak,
                behandling,
                kanSendeInnHelgForMeldekort,
                (perioder) => perioder.toSpliced(index, 1),
            );
        }
    }

    throw new Error(`Ugyldig action: ${type satisfies never}`);
};

const velgTiltak = (
    state: InnvilgelseState,
    payload: Extract<InnvilgelsesperioderActions, { type: 'velgTiltak' }>['payload'],
): InnvilgelseState => {
    const { tiltak, valgt, behandling, kanSendeInnHelgForMeldekort, vedtaksperiode, avgrensning } =
        payload;

    const forrigeTiltak = state.innvilgelsesperioder.tiltak;
    const erValgtFraFør = forrigeTiltak.some((it) => erSammeTiltak(it, tiltak));

    if (valgt === erValgtFraFør) {
        return state;
    }

    const tiltakSomKanVelges = hentTiltakSomKanVelges(
        behandling,
        [...forrigeTiltak, tiltak],
        vedtaksperiode,
    );

    const nyeTiltak: InnvilgelseForTiltak[] = valgt
        ? sorterTiltak(
              [
                  ...forrigeTiltak,
                  lagInnvilgelseForTiltak(
                      nonNullish(
                          tiltakSomKanVelges.find((it) => it.erGyldig && erSammeTiltak(it, tiltak)),
                          `Kan ikke velge tiltak ${tiltak.internDeltakelseId}`,
                      ),
                      avgrensning,
                  ),
              ],
              tiltakSomKanVelges,
          )
        : forrigeTiltak.filter((it) => !erSammeTiltak(it, tiltak));

    if (nyeTiltak.length === 0) {
        return utenPerioder;
    }

    if (!state.harValgtPeriode) {
        const innvilgelsesperioder = medAntallDager(
            nyeTiltak,
            state.innvilgelsesperioder,
            behandling,
            kanSendeInnHelgForMeldekort,
        );

        return {
            harValgtPeriode: true,
            innvilgelsesperioder,
            ...lagBarnetilleggSkjemaState(behandling, innvilgelsesperioder),
        };
    }

    return medTiltak(state, nyeTiltak, behandling, kanSendeInnHelgForMeldekort);
};

const oppdaterPerioderForTiltak = (
    state: InnvilgelseMedPerioderState,
    tiltak: TiltakNøkkel,
    behandling: Rammebehandling,
    kanSendeInnHelgForMeldekort: boolean,
    oppdater: (perioder: InnvilgelsesperiodeForTiltak[]) => InnvilgelsesperiodeForTiltak[],
): InnvilgelseState => {
    const nyeTiltak = state.innvilgelsesperioder.tiltak
        .map((it) => (erSammeTiltak(it, tiltak) ? { ...it, perioder: oppdater(it.perioder) } : it))
        // Et tiltak uten perioder er ikke valgt
        .filter((it) => it.perioder.length > 0);

    if (nyeTiltak.length === 0) {
        return utenPerioder;
    }

    return medTiltak(state, nyeTiltak, behandling, kanSendeInnHelgForMeldekort);
};

const utenPerioder: InnvilgelseState = {
    harValgtPeriode: false,
    innvilgelsesperioder: { tiltak: [], antallDagerPerMeldeperiode: [] },
};

const medAntallDager = (
    tiltak: InnvilgelseForTiltak[],
    forrige: Innvilgelsesperioder,
    behandling: Rammebehandling,
    kanSendeInnHelgForMeldekort: boolean,
): Innvilgelsesperioder => ({
    tiltak,
    antallDagerPerMeldeperiode: tilpassAntallDager(
        behandling,
        tiltak,
        forrige,
        kanSendeInnHelgForMeldekort,
    ),
});

// Antall dager og barnetillegget tilpasses de nye periodene for tiltakene
const medTiltak = (
    state: InnvilgelseMedPerioderState,
    nyeTiltak: InnvilgelseForTiltak[],
    behandling: Rammebehandling,
    kanSendeInnHelgForMeldekort: boolean,
): InnvilgelseMedPerioderState => {
    const innvilgelsesperioder = medAntallDager(
        nyeTiltak,
        state.innvilgelsesperioder,
        behandling,
        kanSendeInnHelgForMeldekort,
    );

    return {
        ...state,
        innvilgelsesperioder,
        valgteBarn: tilpassBarnTilInnvilgelsesperiodene(state.valgteBarn, innvilgelsesperioder),
    };
};
