import { describe, expect, test } from '@jest/globals';
import {
    antallDager,
    innvilgelsesperiode,
    innvilgelsesperioder,
    periode,
    søknad,
    søknadBarn,
    søknadsbehandlingIkkeValgt,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import {
    InnvilgelseMedPerioderState,
    InnvilgelseUtenPerioderState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    InnvilgelsesperioderActions,
    innvilgelsesperioderReducer,
} from '~/lib/rammebehandling/context/innvilgelse/slices/innvilgelsesperiodeContext';
import { Periode } from '~/types/Periode';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { tilDato } from '~/types/DatoTid';
import { hentBarnFraSøknader } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { TiltakNøkkel } from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { InnvilgelseForTiltak } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';

const tiltak1: TiltakNøkkel = { internDeltakelseId: 'deltakelse_1', erReversertOpphør: false };
const tiltak2: TiltakNøkkel = { internDeltakelseId: 'deltakelse_2', erReversertOpphør: false };

// Barnet er under 16 år i hele tiltaksdeltakelsen (2025-01-01 - 2025-06-30)
const behandlingMedBarnISøknad = søknadsbehandlingIkkeValgt({
    søknad: søknad([søknadBarn('2015-03-01')]),
});

const barnFraSøknaden = hentBarnFraSøknader(behandlingMedBarnISøknad, {
    tiltak: [innvilgelsesperiode(periode('2025-01-01', '2025-06-30'))],
}).atNonNull(0).barn;

const deltakelse2 = tiltaksdeltakelse('deltakelse_2', periode('2025-03-01', '2025-06-30'), 3);

const behandlingMedToTiltak: Rammebehandling = {
    ...behandlingMedBarnISøknad,
    saksopplysninger: {
        ...behandlingMedBarnISøknad.saksopplysninger,
        tiltaksdeltagelse: [
            ...behandlingMedBarnISøknad.saksopplysninger.tiltaksdeltagelse,
            deltakelse2,
        ],
    },
    innvilgbarePerioder: [
        ...behandlingMedBarnISøknad.innvilgbarePerioder,
        { internDeltakelseId: deltakelse2.internDeltakelseId, periode: deltakelse2.periode },
    ],
};

const utenPerioderState: InnvilgelseUtenPerioderState = {
    harValgtPeriode: false,
    innvilgelsesperioder: { tiltak: [], antallDagerPerMeldeperiode: [] },
};

const medPerioderState = (
    overstyringer: Partial<InnvilgelseMedPerioderState> = {},
): InnvilgelseMedPerioderState => ({
    harValgtPeriode: true,
    innvilgelsesperioder: innvilgelsesperioder([
        innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
    ]),
    harBarnetillegg: true,
    valgteBarn: [barnFraSøknaden],
    manueltLagtTilBarn: [],
    ...overstyringer,
});

// Ett tiltak med flere perioder
const tiltakMedPerioder = (tiltak: TiltakNøkkel, ...perioder: Periode[]): InnvilgelseForTiltak => ({
    ...tiltak,
    perioder: perioder.map((periode) => ({ periode })),
});

const velgTiltak = (
    tiltak: TiltakNøkkel,
    valgt: boolean,
    behandling: Rammebehandling = behandlingMedToTiltak,
    avgrensning?: Periode,
    kanSendeInnHelgForMeldekort = true,
): InnvilgelsesperioderActions => ({
    type: 'velgTiltak',
    payload: { tiltak, valgt, behandling, kanSendeInnHelgForMeldekort, avgrensning },
});

const oppdaterTiltakPeriode = (
    periodeOppdatering: Partial<Periode>,
    {
        tiltak = tiltak1,
        index = 0,
        behandling = behandlingMedBarnISøknad,
    }: {
        tiltak?: TiltakNøkkel;
        index?: number;
        behandling?: Rammebehandling;
    } = {},
): InnvilgelsesperioderActions => ({
    type: 'oppdaterTiltakPeriode',
    payload: { tiltak, index, periodeOppdatering, behandling, kanSendeInnHelgForMeldekort: true },
});

const settAntallDager = (index: number, antallDager: number): InnvilgelsesperioderActions => ({
    type: 'settAntallDager',
    payload: { index, antallDager },
});

describe('innvilgelsesperioderReducer', () => {
    describe('velgTiltak', () => {
        test('forhåndsutfyller tiltaket innenfor avgrensningen og barnetillegget fra søknaden', () => {
            expect(
                innvilgelsesperioderReducer(
                    utenPerioderState,
                    velgTiltak(
                        tiltak1,
                        true,
                        behandlingMedBarnISøknad,
                        periode('2025-02-01', '2025-08-31'),
                    ),
                ),
            ).toEqual({
                harValgtPeriode: true,
                innvilgelsesperioder: innvilgelsesperioder([
                    innvilgelsesperiode(periode('2025-02-01', '2025-06-30')),
                ]),
                harBarnetillegg: true,
                valgteBarn: [barnFraSøknaden],
                manueltLagtTilBarn: [],
            });
        });

        test('forhåndsutfyller antall dager fra tiltaksdeltakelsen', () => {
            expect(
                innvilgelsesperioderReducer(utenPerioderState, velgTiltak(tiltak2, true))
                    .innvilgelsesperioder,
            ).toEqual({
                tiltak: [tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30'))],
                antallDagerPerMeldeperiode: [antallDager(periode('2025-03-01', '2025-06-30'), 6)],
            });
        });

        test('tillater overlapp med andre tiltak, og sorterer tiltakene i visningsrekkefølge', () => {
            const medTiltak1 = innvilgelsesperioderReducer(
                utenPerioderState,
                velgTiltak(tiltak1, true),
            );

            const nyState = innvilgelsesperioderReducer(medTiltak1, velgTiltak(tiltak2, true));

            // Samme rekkefølge som i saksopplysningene, stigende etter fra og med-dato
            expect(nyState).toMatchObject({
                innvilgelsesperioder: {
                    tiltak: [
                        tiltakMedPerioder(tiltak1, periode('2025-01-01', '2025-06-30')),
                        tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30')),
                    ],
                },
            });
        });

        test('deler opp i delperioder, og forhåndsutfyller summen av antall dager der tiltakene overlapper', () => {
            const medTiltak1 = innvilgelsesperioderReducer(
                medPerioderState(),
                settAntallDager(0, 8),
            );

            const nyState = innvilgelsesperioderReducer(medTiltak1, velgTiltak(tiltak2, true));

            // Tiltak 1 beholder antall dager der det er alene.
            // Der tiltakene overlapper, brukes summen fra tiltaksdeltakelsene (10 + 6), maks 14.
            expect(nyState.innvilgelsesperioder.antallDagerPerMeldeperiode).toEqual([
                antallDager(periode('2025-01-01', '2025-02-28'), 8),
                antallDager(periode('2025-03-01', '2025-03-31'), 14),
                antallDager(periode('2025-04-01', '2025-06-30'), 6),
            ]);
        });

        test('forhåndsutfyller maks 10 dager der tiltakene overlapper når det ikke kan meldes for helg', () => {
            const nyState = innvilgelsesperioderReducer(
                medPerioderState(),
                velgTiltak(tiltak2, true, behandlingMedToTiltak, undefined, false),
            );

            expect(nyState.innvilgelsesperioder.antallDagerPerMeldeperiode.at(1)).toEqual(
                antallDager(periode('2025-03-01', '2025-03-31'), 10),
            );
        });

        test('tilpasser barnetillegget når et tiltak velges bort', () => {
            const state = medPerioderState({
                innvilgelsesperioder: {
                    tiltak: [
                        tiltakMedPerioder(tiltak1, periode('2025-01-01', '2025-02-28')),
                        tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30')),
                    ],
                    antallDagerPerMeldeperiode: [
                        antallDager(periode('2025-01-01', '2025-02-28'), 10),
                        antallDager(periode('2025-03-01', '2025-06-30'), 4),
                    ],
                },
                valgteBarn: [
                    { ...barnFraSøknaden, perioder: [periode('2025-01-01', '2025-06-30')] },
                ],
            });

            expect(innvilgelsesperioderReducer(state, velgTiltak(tiltak1, false))).toEqual(
                medPerioderState({
                    innvilgelsesperioder: {
                        tiltak: [tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30'))],
                        antallDagerPerMeldeperiode: [
                            antallDager(periode('2025-03-01', '2025-06-30'), 4),
                        ],
                    },
                    valgteBarn: [
                        { ...barnFraSøknaden, perioder: [periode('2025-03-01', '2025-06-30')] },
                    ],
                }),
            );
        });

        test('går tilbake til ingen valgte tiltak når det siste velges bort', () => {
            expect(
                innvilgelsesperioderReducer(medPerioderState(), velgTiltak(tiltak1, false)),
            ).toEqual(utenPerioderState);
        });

        test('kaster feil for et tiltak som ikke kan velges', () => {
            expect(() =>
                innvilgelsesperioderReducer(
                    utenPerioderState,
                    velgTiltak(tiltak2, true, behandlingMedBarnISøknad),
                ),
            ).toThrow();
        });
    });

    test.each<InnvilgelsesperioderActions>([
        { type: 'settAntallDager', payload: { antallDager: 8, index: 0 } },
        {
            type: 'leggTilTiltakPeriode',
            payload: {
                tiltak: tiltak1,
                behandling: behandlingMedBarnISøknad,
                kanSendeInnHelgForMeldekort: true,
            },
        },
        oppdaterTiltakPeriode({ fraOgMed: tilDato('2025-01-06') }),
    ])('kaster feil for $type før et tiltak er valgt', (action) => {
        expect(() => innvilgelsesperioderReducer(utenPerioderState, action)).toThrow();
    });

    describe('oppdaterTiltakPeriode', () => {
        test('beholder valgte barn med hele innvilgelsesperioden når perioden endres', () => {
            expect(
                innvilgelsesperioderReducer(
                    medPerioderState(),
                    oppdaterTiltakPeriode({ tilOgMed: tilDato('2025-02-28') }),
                ),
            ).toEqual(
                medPerioderState({
                    innvilgelsesperioder: innvilgelsesperioder([
                        innvilgelsesperiode(periode('2025-01-01', '2025-02-28')),
                    ]),
                }),
            );
        });

        test('justerer andre perioder for samme tiltak slik at de ikke overlapper, og beholder antall dager', () => {
            const state = medPerioderState({
                innvilgelsesperioder: {
                    tiltak: [
                        tiltakMedPerioder(
                            tiltak1,
                            periode('2025-01-01', '2025-01-31'),
                            periode('2025-02-01', '2025-03-31'),
                        ),
                    ],
                    antallDagerPerMeldeperiode: [
                        antallDager(periode('2025-01-01', '2025-01-31'), 10),
                        antallDager(periode('2025-02-01', '2025-03-31'), 6),
                    ],
                },
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterTiltakPeriode({ tilOgMed: tilDato('2025-02-15') }),
            );

            expect(nyState.innvilgelsesperioder).toEqual({
                tiltak: [
                    tiltakMedPerioder(
                        tiltak1,
                        periode('2025-01-01', '2025-02-15'),
                        periode('2025-02-16', '2025-03-31'),
                    ),
                ],
                antallDagerPerMeldeperiode: [
                    antallDager(periode('2025-01-01', '2025-02-15'), 10),
                    antallDager(periode('2025-02-16', '2025-03-31'), 6),
                ],
            });
        });

        test('endrer ikke perioder for andre tiltak, og beholder antall dager for delperioder med de samme tiltakene', () => {
            const tiltak2Perioder = tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30'));

            const state = medPerioderState({
                innvilgelsesperioder: {
                    tiltak: [
                        tiltakMedPerioder(tiltak1, periode('2025-01-01', '2025-03-31')),
                        tiltak2Perioder,
                    ],
                    antallDagerPerMeldeperiode: [
                        antallDager(periode('2025-01-01', '2025-02-28'), 10),
                        antallDager(periode('2025-03-01', '2025-03-31'), 12),
                        antallDager(periode('2025-04-01', '2025-06-30'), 6),
                    ],
                },
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterTiltakPeriode(
                    { tilOgMed: tilDato('2025-04-30') },
                    { behandling: behandlingMedToTiltak },
                ),
            );

            expect(nyState.innvilgelsesperioder).toEqual({
                tiltak: [
                    tiltakMedPerioder(tiltak1, periode('2025-01-01', '2025-04-30')),
                    tiltak2Perioder,
                ],
                antallDagerPerMeldeperiode: [
                    antallDager(periode('2025-01-01', '2025-02-28'), 10),
                    antallDager(periode('2025-03-01', '2025-04-30'), 12),
                    antallDager(periode('2025-05-01', '2025-06-30'), 6),
                ],
            });
        });

        test('avgrenser overstyrt periode for et barn til den nye innvilgelsesperioden', () => {
            const state = medPerioderState({
                valgteBarn: [
                    { ...barnFraSøknaden, perioder: [periode('2025-02-01', '2025-03-31')] },
                ],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterTiltakPeriode({ tilOgMed: tilDato('2025-02-28') }),
            );

            expect(nyState).toMatchObject({
                valgteBarn: [
                    { ...barnFraSøknaden, perioder: [periode('2025-02-01', '2025-02-28')] },
                ],
            });
        });

        test('fjerner perioder for et barn som havner utenfor den nye innvilgelsesperioden', () => {
            const state = medPerioderState({
                valgteBarn: [
                    {
                        ...barnFraSøknaden,
                        perioder: [
                            periode('2025-01-01', '2025-01-31'),
                            periode('2025-02-15', '2025-03-15'),
                            periode('2025-04-01', '2025-04-30'),
                        ],
                    },
                ],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterTiltakPeriode({ tilOgMed: tilDato('2025-02-28') }),
            );

            expect(nyState).toMatchObject({
                valgteBarn: [
                    {
                        ...barnFraSøknaden,
                        perioder: [
                            periode('2025-01-01', '2025-01-31'),
                            periode('2025-02-15', '2025-02-28'),
                        ],
                    },
                ],
            });
        });
    });

    test('leggTilTiltakPeriode legger til en periode ut tiltaksdeltakelsen, med antall dager fra tiltaksdeltakelsen', () => {
        const state = medPerioderState({
            innvilgelsesperioder: innvilgelsesperioder(
                [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
                8,
            ),
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'leggTilTiltakPeriode',
                payload: {
                    tiltak: tiltak1,
                    behandling: behandlingMedBarnISøknad,
                    kanSendeInnHelgForMeldekort: true,
                },
            }),
        ).toEqual(
            medPerioderState({
                innvilgelsesperioder: {
                    tiltak: [
                        tiltakMedPerioder(
                            tiltak1,
                            periode('2025-01-01', '2025-03-31'),
                            periode('2025-04-01', '2025-06-30'),
                        ),
                    ],
                    antallDagerPerMeldeperiode: [
                        antallDager(periode('2025-01-01', '2025-03-31'), 8),
                        antallDager(periode('2025-04-01', '2025-06-30'), 10),
                    ],
                },
            }),
        );
    });

    test('fjernTiltakPeriode fjerner perioden og tilpasser barnetillegget', () => {
        const state = medPerioderState({
            innvilgelsesperioder: innvilgelsesperioder([
                tiltakMedPerioder(
                    tiltak1,
                    periode('2025-01-01', '2025-03-31'),
                    periode('2025-04-01', '2025-06-30'),
                ),
            ]),
            valgteBarn: [{ ...barnFraSøknaden, perioder: [periode('2025-02-01', '2025-06-30')] }],
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'fjernTiltakPeriode',
                payload: {
                    tiltak: tiltak1,
                    index: 1,
                    behandling: behandlingMedBarnISøknad,
                    kanSendeInnHelgForMeldekort: true,
                },
            }),
        ).toEqual(
            medPerioderState({
                valgteBarn: [
                    { ...barnFraSøknaden, perioder: [periode('2025-02-01', '2025-03-31')] },
                ],
            }),
        );
    });

    test('settAntallDager endrer kun valgt delperiode', () => {
        const tiltak = [
            tiltakMedPerioder(
                tiltak1,
                periode('2025-01-01', '2025-03-31'),
                periode('2025-04-01', '2025-06-30'),
            ),
            tiltakMedPerioder(tiltak2, periode('2025-03-01', '2025-06-30')),
        ];

        const state = medPerioderState({
            innvilgelsesperioder: {
                tiltak,
                antallDagerPerMeldeperiode: [
                    antallDager(periode('2025-01-01', '2025-02-28'), 10),
                    antallDager(periode('2025-03-01', '2025-03-31'), 14),
                    antallDager(periode('2025-04-01', '2025-06-30'), 14),
                ],
            },
        });

        expect(
            innvilgelsesperioderReducer(state, settAntallDager(1, 4)).innvilgelsesperioder,
        ).toEqual({
            tiltak,
            antallDagerPerMeldeperiode: [
                antallDager(periode('2025-01-01', '2025-02-28'), 10),
                antallDager(periode('2025-03-01', '2025-03-31'), 4),
                antallDager(periode('2025-04-01', '2025-06-30'), 14),
            ],
        });
    });
});
