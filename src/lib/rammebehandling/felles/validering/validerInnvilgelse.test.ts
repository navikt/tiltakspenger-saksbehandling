import { describe, expect, test } from '@jest/globals';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import {
    innvilgelsesperiode,
    omgjøringInnvilgelse,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    sakMedInnvilgetVedtak,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggBarnSkjema } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';

// Standard tiltaksdeltakelse i testbehandlingene er 01.01.2025 - 30.06.2025
const januar = periode('2025-01-01', '2025-01-31');
const februar = periode('2025-02-01', '2025-02-28');
const marsTilJuni = periode('2025-03-01', '2025-06-30');
const førsteHalvår = periode('2025-01-01', '2025-06-30');

const innvilgelse = (
    innvilgelsesperioder: Innvilgelsesperiode[],
    barnetillegg: BarnetilleggBarnSkjema[] = [],
) => ({
    harValgtPeriode: true as const,
    innvilgelsesperioder,
    harBarnetillegg: barnetillegg.length > 0,
    valgteBarn: barnetillegg,
    manueltLagtTilBarn: [],
});

const søknadsbehandlingSkjema = (
    innvilgelsesperioder: Innvilgelsesperiode[],
    barnetillegg: BarnetilleggBarnSkjema[] = [],
): BehandlingMedInnvilgelseState => ({
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: innvilgelse(innvilgelsesperioder, barnetillegg),
});

// Har fylt 16 år før innvilgelsesperiodene i testene
const forGammeltBarn = skjemaBarn('2008-01-01');

describe('validerInnvilgelse', () => {
    test('krever valgt innvilgelsesperiode før noe annet valideres', () => {
        const resultat = validerInnvilgelse(sak(), søknadsbehandlingInnvilgelse(), {
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            innvilgelse: { harValgtPeriode: false, innvilgelsesperioder: [{ periode: {} }] },
        });

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
        );

        expect(resultat.errors).toEqual(['Innvilgelsesperiodene må være uten overlapp']);
    });

    test('avviser en lagret innvilgelsesperiode som backend har validert at ikke passer med tiltaksdeltakelsen', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder: [
                {
                    ...innvilgelsesperiode(førsteHalvår),
                    ugyldigTiltaksdeltakelse: {
                        type: 'DEKKER_IKKE_PERIODEN',
                        deltakelsesperiode: periode('2025-01-01', '2025-05-31'),
                    },
                },
            ],
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
            innvilgelsesperioder: [
                {
                    ...innvilgelsesperiode(førsteHalvår),
                    ugyldigTiltaksdeltakelse: {
                        type: 'DEKKER_IKKE_PERIODEN',
                        deltakelsesperiode: periode('2025-01-01', '2025-05-31'),
                    },
                },
            ],
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

        expect(resultat.errors).toEqual(['Til og med-dato må være etter fra og med-dato']);
    });

    test('tar med feil fra både valgte tiltaksdeltakelser og barnetillegg', () => {
        const behandling = søknadsbehandlingInnvilgelse({
            innvilgelsesperioder: [
                {
                    ...innvilgelsesperiode(førsteHalvår),
                    ugyldigTiltaksdeltakelse: { type: 'FINNES_IKKE', deltakelsesperiode: null },
                },
            ],
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
