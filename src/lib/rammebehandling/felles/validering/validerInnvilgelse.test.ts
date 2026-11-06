import { describe, expect, test } from '@jest/globals';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    omgjøringInnvilgelse,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    sakMedInnvilgetVedtak,
    søknad,
    søknadsbehandlingInnvilgelse,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Tiltaksdeltakelse } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';

// Standard tiltaksdeltakelse i testbehandlingene er 01.01.2025 - 30.06.2025
const januar = periode('2025-01-01', '2025-01-31');
const februar = periode('2025-02-01', '2025-02-28');
const marsTilJuni = periode('2025-03-01', '2025-06-30');
const førsteHalvår = periode('2025-01-01', '2025-06-30');

const innvilgelse = (
    innvilgelsesperioder: Innvilgelsesperiode[],
    barnetillegg: BarnetilleggPeriode[] = [],
) => ({
    harValgtPeriode: true as const,
    innvilgelsesperioder,
    harBarnetillegg: barnetillegg.length > 0,
    barnetilleggPerioder: barnetillegg,
});

const søknadsbehandlingSkjema = (
    innvilgelsesperioder: Innvilgelsesperiode[],
    barnetillegg: BarnetilleggPeriode[] = [],
): BehandlingMedInnvilgelseState => ({
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: innvilgelse(innvilgelsesperioder, barnetillegg),
});

const medTiltak = <T extends Rammebehandling>(
    behandling: T,
    ...tiltaksdeltagelse: Tiltaksdeltakelse[]
): T => ({
    ...behandling,
    saksopplysninger: { ...behandling.saksopplysninger, tiltaksdeltagelse },
});

describe('validerInnvilgelse', () => {
    test('krever valgt innvilgelsesperiode før noe annet valideres', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            {
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                innvilgelse: { harValgtPeriode: false, innvilgelsesperioder: [{ periode: {} }] },
            },
            søknad(),
        );

        expect(resultat).toEqual({
            errors: ['Minst en fullstendig innvilgelsesperiode må være valgt'],
            warnings: [],
        });
    });

    test('godtar en innvilgelse som dekker hele tiltaksdeltakelsen', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(førsteHalvår)]),
            søknad(),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('avviser overlappende innvilgelsesperioder', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([
                innvilgelsesperiode(periode('2025-01-01', '2025-03-01')),
                innvilgelsesperiode(marsTilJuni),
            ]),
            søknad(),
        );

        expect(resultat.errors).toEqual(['Innvilgelsesperiodene må være uten overlapp']);
    });

    test('avviser en innvilgelse som starter før tiltaksdeltakelsen', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(periode('2024-12-31', '2025-06-30'))]),
            søknad(),
        );

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
        ]);
    });

    test('avviser en innvilgelse som slutter etter tiltaksdeltakelsen', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(periode('2025-01-01', '2025-07-01'))]),
            søknad(),
        );

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
        ]);
    });

    test('avviser en innvilgelsesperiode der til og med-dato er før fra og med-dato', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema([innvilgelsesperiode(periode('2025-03-01', '2025-02-01'))]),
            søknad(),
        );

        expect(resultat.errors).toEqual(['Til og med-dato må være etter fra og med-dato']);
    });

    test('avviser innvilgelse uten tiltaksdeltakelser som kan innvilges, og stopper videre validering', () => {
        const behandling = medTiltak(søknadsbehandlingInnvilgelse(), {
            ...tiltaksdeltakelse('deltakelse_1', førsteHalvår),
            kanInnvilges: false,
        });

        const resultat = validerInnvilgelse(
            sak(),
            behandling,
            // Barnetillegg uten perioder ville ellers gitt en egen feil
            {
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                innvilgelse: {
                    ...innvilgelse([innvilgelsesperiode(førsteHalvår)]),
                    harBarnetillegg: true,
                },
            },
            søknad(),
        );

        expect(resultat).toEqual({
            errors: ['Fant ingen tiltaksdeltakelser som kan innvilges i saksopplysningene.'],
            warnings: [],
        });
    });

    test('tar med feil fra både valgte tiltaksdeltakelser og barnetillegg', () => {
        const behandling = medTiltak(
            søknadsbehandlingInnvilgelse(),
            tiltaksdeltakelse('tiltak_a', periode('2025-01-01', '2025-03-31')),
            tiltaksdeltakelse('tiltak_b', periode('2025-04-01', '2025-06-30')),
        );

        const resultat = validerInnvilgelse(
            sak(),
            behandling,
            søknadsbehandlingSkjema(
                [innvilgelsesperiode(førsteHalvår, { internDeltakelseId: 'tiltak_a' })],
                [barnetilleggPeriode(0, førsteHalvår)],
            ),
            søknad(),
        );

        expect(resultat).toEqual({
            errors: [
                'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
                'Minst en periode må ha barn når barnetillegg er valgt',
            ],
            warnings: ['Det er innvilget barnetillegg uten at vi har mottatt søknad med barn'],
        });
    });

    test('barnetillegget valideres ikke når det ikke skal valideres', () => {
        const resultat = validerInnvilgelse(
            sak(),
            søknadsbehandlingInnvilgelse(),
            søknadsbehandlingSkjema(
                [innvilgelsesperiode(førsteHalvår)],
                [barnetilleggPeriode(0, førsteHalvår)],
            ),
            søknad(),
            { validerBarnetillegg: false },
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    describe('hull mellom innvilgelsesperiodene', () => {
        const innvilgelsesperioderMedHullIFebruar = [
            innvilgelsesperiode(januar),
            innvilgelsesperiode(marsTilJuni),
        ];

        test('godtas når det ikke finnes noen tidligere innvilgelse i hullet', () => {
            const resultat = validerInnvilgelse(
                sak(),
                søknadsbehandlingInnvilgelse(),
                søknadsbehandlingSkjema(innvilgelsesperioderMedHullIFebruar),
                søknad(),
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
                søknad(),
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
                søknad(),
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

            const resultat = validerInnvilgelse(
                sakMedStansIFebruar,
                revurderingInnvilgelse(),
                {
                    resultat: RevurderingResultat.INNVILGELSE,
                    innvilgelse: innvilgelse(innvilgelsesperioderMedHullIFebruar),
                },
                søknad(),
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });
    });
});
