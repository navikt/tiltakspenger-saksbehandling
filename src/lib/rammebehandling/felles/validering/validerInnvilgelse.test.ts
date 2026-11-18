import { describe, expect, test } from '@jest/globals';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import {
    barnetilleggPeriode,
    antallDager,
    barnetilleggV1,
    innvilgelsesperiode,
    innvilgelsesperioder,
    omgjøringInnvilgelse,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    sakMedInnvilgetVedtak,
    søknadsbehandlingInnvilgelse,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    AntallDagerForPeriode,
    InnvilgelseForTiltak,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { hentDelperioder } from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { Periode } from '~/types/Periode';
import { BarnetilleggBarnSkjema } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';

// Standard tiltaksdeltakelse i testbehandlingene er 01.01.2025 - 30.06.2025
const januar = periode('2025-01-01', '2025-01-31');
const februar = periode('2025-02-01', '2025-02-28');
const marsTilJuni = periode('2025-03-01', '2025-06-30');
const førsteHalvår = periode('2025-01-01', '2025-06-30');

// Ett tiltak med flere perioder
const tiltakMedPerioder = (
    perioder: Periode[],
    internDeltakelseId = 'deltakelse_1',
): InnvilgelseForTiltak => ({
    internDeltakelseId,
    erReversertOpphør: false,
    perioder: perioder.map((periode) => ({ periode })),
});

const deltakelse2 = tiltaksdeltakelse('deltakelse_2', førsteHalvår);

const søknadsbehandlingMedToTiltak = () => {
    const behandling = søknadsbehandlingInnvilgelse();

    return {
        ...behandling,
        saksopplysninger: {
            ...behandling.saksopplysninger,
            tiltaksdeltagelse: [
                ...behandling.saksopplysninger.tiltaksdeltagelse,
                { ...deltakelse2, typeNavn: 'Jobbklubb' },
            ],
        },
        innvilgbarePerioder: [
            ...behandling.innvilgbarePerioder,
            { internDeltakelseId: deltakelse2.internDeltakelseId, periode: deltakelse2.periode },
        ],
    };
};

// Antall dager er 10 for hver delperiode, med mindre det er satt
const innvilgelse = (
    tiltak: InnvilgelseForTiltak[],
    barnetillegg: BarnetilleggBarnSkjema[] = [],
    antallDagerPerMeldeperiode: AntallDagerForPeriode[] = hentDelperioder(tiltak).map(
        ({ periode }) => antallDager(periode, 10),
    ),
) => ({
    harValgtPeriode: true as const,
    innvilgelsesperioder: { tiltak, antallDagerPerMeldeperiode },
    harBarnetillegg: barnetillegg.length > 0,
    valgteBarn: barnetillegg,
    manueltLagtTilBarn: [],
});

const søknadsbehandlingSkjema = (
    tiltak: InnvilgelseForTiltak[],
    barnetillegg: BarnetilleggBarnSkjema[] = [],
    antallDagerPerMeldeperiode?: AntallDagerForPeriode[],
): BehandlingMedInnvilgelseState => ({
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: innvilgelse(tiltak, barnetillegg, antallDagerPerMeldeperiode),
});

// Har fylt 16 år før innvilgelsesperiodene i testene
const forGammeltBarn = skjemaBarn('2008-01-01');

describe('validerInnvilgelse', () => {
    test('krever valgt tiltak før noe annet valideres', () => {
        const resultat = validerInnvilgelse(sak(), søknadsbehandlingInnvilgelse(), {
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            innvilgelse: {
                harValgtPeriode: false,
                innvilgelsesperioder: { tiltak: [], antallDagerPerMeldeperiode: [] },
            },
        });

        expect(resultat).toEqual({
            errors: ['Minst ett tiltak med en innvilgelsesperiode må være valgt'],
            warnings: [],
        });
    });

    test('godtar en innvilgelse som dekker hele tiltaksdeltakelsen', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)]),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('avviser overlappende perioder for samme tiltak', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([
                tiltakMedPerioder([periode('2025-01-01', '2025-03-01'), marsTilJuni]),
            ]),
        );

        expect(resultat.errors).toEqual([
            'Periodene for Arbeidsmarkedsopplæring kan ikke overlappe hverandre',
        ]);
    });

    test('godtar overlappende perioder for ulike tiltak', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingMedToTiltak(),
            søknadsbehandlingSkjema([
                tiltakMedPerioder([førsteHalvår], 'deltakelse_1'),
                tiltakMedPerioder([marsTilJuni], 'deltakelse_2'),
            ]),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('avviser antall dager per meldeperiode under 1 eller over 14 for en delperiode', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingMedToTiltak(),
            søknadsbehandlingSkjema(
                [
                    tiltakMedPerioder([førsteHalvår], 'deltakelse_1'),
                    tiltakMedPerioder([marsTilJuni], 'deltakelse_2'),
                ],
                [],
                [antallDager(periode('2025-01-01', '2025-02-28'), 0), antallDager(marsTilJuni, 15)],
            ),
        );

        expect(resultat.errors).toEqual([
            'Antall dager per meldeperiode må være mellom 1 og 14 (01.01.2025 - 28.02.2025)',
            'Antall dager per meldeperiode må være mellom 1 og 14 (01.03.2025 - 30.06.2025)',
        ]);
    });

    test('avviser et tiltak som ikke kan innvilges', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([tiltakMedPerioder([førsteHalvår], 'deltakelse_2')]),
        );

        expect(resultat.errors).toEqual(['Kan ikke innvilge for Tiltak med id deltakelse_2']);
    });

    test('avviser reversert opphør som overlapper et vanlig tiltak', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([
                tiltakMedPerioder([førsteHalvår]),
                { ...tiltakMedPerioder([januar]), erReversertOpphør: true },
            ]),
        );

        expect(resultat.errors).toContain(
            'Reversert opphør kan ikke overlappe perioder med en gyldig tiltaksdeltakelse',
        );
    });

    test('avviser en lagret innvilgelsesperiode som backend har validert at ikke passer med tiltaksdeltakelsen', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder: {
                ...innvilgelsesperioder([innvilgelsesperiode(førsteHalvår)]),
                tiltak: [
                    {
                        ...innvilgelsesperiode(førsteHalvår),
                        perioder: [
                            {
                                periode: førsteHalvår,
                                ugyldigTiltaksdeltakelse: {
                                    type: 'DEKKER_IKKE_PERIODEN',
                                    deltakelsesperiode: periode('2025-01-01', '2025-05-31'),
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const resultat = validerInnvilgelse(
            sak(),
            behandling,
            søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)]),
        );

        expect(resultat.errors).toEqual([
            'Innvilgelsesperioden må være innenfor tiltaksdeltakelsens periode (01.01.2025 - 31.05.2025)',
        ]);
    });

    test('godtar en innvilgelsesperiode som er endret etter lagring, siden backend validerer den ved neste lagring', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder: {
                ...innvilgelsesperioder([innvilgelsesperiode(førsteHalvår)]),
                tiltak: [
                    {
                        ...innvilgelsesperiode(førsteHalvår),
                        perioder: [
                            {
                                periode: førsteHalvår,
                                ugyldigTiltaksdeltakelse: {
                                    type: 'DEKKER_IKKE_PERIODEN',
                                    deltakelsesperiode: periode('2025-01-01', '2025-05-31'),
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const resultat = validerInnvilgelse(
            sak(),
            behandling,
            søknadsbehandlingSkjema([innvilgelsesperiode(periode('2025-01-01', '2025-05-31'))]),
        );

        expect(resultat.errors).toEqual([]);
    });

    test('avviser en innvilgelsesperiode der til og med-dato er før fra og med-dato', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(periode('2025-03-01', '2025-02-01'))]),
        );

        expect(resultat.errors).toEqual([
            'Til og med-dato må være etter fra og med-dato for Arbeidsmarkedsopplæring (01.03.2025 - 01.02.2025)',
        ]);
    });

    test('tar med feil fra både valgte tiltaksdeltakelser og barnetillegg', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder: {
                ...innvilgelsesperioder([innvilgelsesperiode(førsteHalvår)]),
                tiltak: [
                    {
                        ...innvilgelsesperiode(førsteHalvår),
                        perioder: [
                            {
                                periode: førsteHalvår,
                                ugyldigTiltaksdeltakelse: {
                                    type: 'FINNES_IKKE',
                                    deltakelsesperiode: null,
                                },
                            },
                        ],
                    },
                ],
            },
        });

        const resultat = validerInnvilgelse(
            sak(),
            behandling,
            søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)], [forGammeltBarn]),
        );

        expect(resultat).toEqual({
            errors: [
                'Valgt tiltaksdeltakelse finnes ikke lenger i saksopplysningene',
                'Barn Barnesen (født 01.01.2008): Barnet har ikke rett til barnetillegg i innvilgelsesperioden (rett fra fødsel til fylte 16 år: 01.01.2008 - 31.12.2023)',
            ],
            warnings: [],
        });
    });

    test('barnetillegget valideres ikke når det ikke skal valideres', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)], [forGammeltBarn]),
            { validerBarnetillegg: false },
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('barnetillegg lagret som antall barn per periode valideres ikke når behandlingen ikke kan endres', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            barnetillegg: barnetilleggV1([barnetilleggPeriode(1, førsteHalvår)]),
        });
        // Søknaden har ingen barn, så ingen barn er forhåndsvalgt
        const skjema = {
            ...søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)]),
            innvilgelse: {
                ...innvilgelse([innvilgelsesperiode(førsteHalvår)]),
                harBarnetillegg: true,
            },
        };

        expect(validerInnvilgelse(sak(), behandling, { ...skjema, erReadonly: true })).toEqual({
            errors: [],
            warnings: [],
        });
        expect(validerInnvilgelse(sak(), behandling, { ...skjema, erReadonly: false })).toEqual({
            errors: ['Velg minst ett barn eller svar nei på om det skal innvilges barnetillegg'],
            warnings: [],
        });
    });

    describe('hull mellom innvilgelsesperiodene', () => {
        const innvilgelsesperioderMedHullIFebruar = [tiltakMedPerioder([januar, marsTilJuni])];

        test('godtas når det ikke finnes noen tidligere innvilgelse i hullet', () => {
            const resultat = validerInnvilgelse(
                sak(),
                søknadsbehandlingInnvilgelse(),
                søknadsbehandlingSkjema(innvilgelsesperioderMedHullIFebruar),
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });

        test('avvises ved revurdering til innvilgelse når hullet opphører en gjeldende innvilgelse', () => {
            const resultat = validerInnvilgelse(
                sakMedInnvilgetVedtak(førsteHalvår),
                revurderingInnvilgelse(),
                {
                    resultat: RevurderingResultat.INNVILGELSE,
                    innvilgelse: innvilgelse(innvilgelsesperioderMedHullIFebruar),
                },
            );

            expect(resultat).toEqual({
                errors: [
                    'Valgte innvilgelsesperioder fører til et delvis opphør - Vi støtter kun opphør ved omgjøring eller stans',
                ],
                warnings: [],
            });
        });

        test('gir bare en advarsel ved omgjøring når hullet opphører en gjeldende innvilgelse', () => {
            const resultat = validerInnvilgelse(
                sakMedInnvilgetVedtak(førsteHalvår),
                omgjøringInnvilgelse(),
                {
                    resultat: RevurderingResultat.OMGJØRING,
                    vedtaksperiode: førsteHalvår,
                    innvilgelse: innvilgelse(innvilgelsesperioderMedHullIFebruar),
                },
            );

            expect(resultat).toEqual({
                errors: [],
                warnings: ['Valgte innvilgelsesperioder fører til et delvis opphør'],
            });
        });

        test('godtas ved revurdering når hullet dekker en periode som allerede er stanset', () => {
            const vedtak = rammevedtak('vedtak_1', førsteHalvår, {
                gjeldendeInnvilgetPerioder: [januar, marsTilJuni],
            });
            const sakMedStansIFebruar = sak({
                rammebehandlinger: [søknadsbehandlingInnvilgelse({ id: vedtak.behandlingId })],
                alleRammevedtak: [vedtak],
                tidslinje: {
                    elementer: [
                        {
                            rammevedtakId: 'vedtak_1',
                            periode: januar,
                            tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                        },
                        {
                            rammevedtakId: 'vedtak_2',
                            periode: februar,
                            tidslinjeResultat: TidslinjeResultat.STANS,
                        },
                        {
                            rammevedtakId: 'vedtak_1',
                            periode: marsTilJuni,
                            tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                        },
                    ],
                },
                innvilgetTidslinje: {
                    elementer: [
                        {
                            rammevedtakId: 'vedtak_1',
                            periode: januar,
                            tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                        },
                        {
                            rammevedtakId: 'vedtak_1',
                            periode: marsTilJuni,
                            tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                        },
                    ],
                },
            });

            const resultat = validerInnvilgelse(sakMedStansIFebruar, revurderingInnvilgelse(), {
                resultat: RevurderingResultat.INNVILGELSE,
                innvilgelse: innvilgelse(innvilgelsesperioderMedHullIFebruar),
            });

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });
    });
});
