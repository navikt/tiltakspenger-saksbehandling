import { describe, expect, test } from '@jest/globals';
import { validerBarnetillegg } from '~/lib/rammebehandling/felles/validering/validerBarnetillegg';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    periode,
    søknad,
    søknadBarn,
} from '~test/rammebehandling';
import { sladdet } from '~test/sladdetVerdi';

const førsteKvartal = periode('2025-01-01', '2025-03-31');
const innvilgelsesperioder = [innvilgelsesperiode(førsteKvartal)];

// Barnet er under 16 år i hele førsteKvartal
const søknadMedEttBarn = søknad([søknadBarn('2020-05-05')]);
const søknadUtenBarn = søknad();

describe('validerBarnetillegg', () => {
    describe('når barnetillegg ikke er innvilget', () => {
        test('gir ingen varsler når søknaden er uten barn', () => {
            expect(validerBarnetillegg(false, [], innvilgelsesperioder, søknadUtenBarn)).toEqual({
                errors: [],
                warnings: [],
            });
        });

        test('advarer om forventet barnetillegg når søknaden har barn, og validerer ikke periodene', () => {
            const resultat = validerBarnetillegg(
                false,
                // Ugyldige perioder skal ikke gi feil når barnetillegg ikke er valgt
                [barnetilleggPeriode(0, periode('2026-01-01', '2026-12-31'))],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat).toEqual({
                errors: [],
                warnings: [
                    'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Forventet barnetillegg fra søknad: 1 barn i perioden 01.01.2025 - 31.03.2025',
                ],
            });
        });

        test('advarer ikke når barnet fra søknaden har fylt 16 år før innvilgelsesperioden', () => {
            const søknadMedForGammeltBarn = søknad([søknadBarn('2008-01-01')]);

            expect(
                validerBarnetillegg(false, [], innvilgelsesperioder, søknadMedForGammeltBarn),
            ).toEqual({ errors: [], warnings: [] });
        });

        test('advarer ikke for barn med sladdet fødselsdato, som må vurderes manuelt', () => {
            const søknadMedSladdetBarn = søknad([
                { ...søknadBarn('2020-05-05'), fødselsdato: sladdet },
            ]);

            expect(
                validerBarnetillegg(false, [], innvilgelsesperioder, søknadMedSladdetBarn),
            ).toEqual({ errors: [], warnings: [] });
        });
    });

    describe('når barnetillegg er innvilget', () => {
        test('godtar barnetillegg som stemmer med barna fra søknaden', () => {
            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, førsteKvartal)],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });

        test('godtar barnetillegg som slutter dagen før barnet fyller 16 år', () => {
            const søknadMedBarnSomFyller16 = søknad([søknadBarn('2009-02-15')]);

            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, periode('2025-01-01', '2025-02-14'))],
                innvilgelsesperioder,
                søknadMedBarnSomFyller16,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });

        test('krever minst en periode, uten å validere noe mer', () => {
            expect(validerBarnetillegg(true, [], innvilgelsesperioder, søknadMedEttBarn)).toEqual({
                errors: ['Minst en periode må spesifiseres når barnetillegg skal innvilges'],
                warnings: [],
            });
        });

        test('advarer når antall barn ikke stemmer med søknaden', () => {
            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(2, førsteKvartal)],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat).toEqual({
                errors: [],
                warnings: [
                    'Innvilget barnetillegg stemmer ikke med barn fra siste søknad - Forventet barnetillegg fra søknad: 1 barn i perioden 01.01.2025 - 31.03.2025',
                ],
            });
        });

        test('advarer når søknaden er uten barn', () => {
            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, førsteKvartal)],
                innvilgelsesperioder,
                søknadUtenBarn,
            );

            expect(resultat).toEqual({
                errors: [],
                warnings: ['Det er innvilget barnetillegg uten at vi har mottatt søknad med barn'],
            });
        });

        test('advarer i tillegg om at barnetillegget ikke dekker hele innvilgelsen når søknaden er uten barn', () => {
            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, periode('2025-02-01', '2025-03-31'))],
                innvilgelsesperioder,
                søknadUtenBarn,
            );

            expect(resultat).toEqual({
                errors: [],
                warnings: [
                    'Den totale perioden for barnetillegg (01.02.2025 - 31.03.2025) fyller ikke hele innvilgelsesperioden (01.01.2025 - 31.03.2025)',
                    'Det er innvilget barnetillegg uten at vi har mottatt søknad med barn',
                ],
            });
        });

        test('avviser overlappende perioder', () => {
            const resultat = validerBarnetillegg(
                true,
                [
                    barnetilleggPeriode(1, periode('2025-01-01', '2025-02-15')),
                    barnetilleggPeriode(2, periode('2025-02-15', '2025-03-31')),
                ],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual(['Periodene for barnetillegg kan ikke ha overlapp']);
        });

        test('godtar hull mellom periodene', () => {
            const resultat = validerBarnetillegg(
                true,
                [
                    barnetilleggPeriode(1, periode('2025-01-01', '2025-01-31')),
                    barnetilleggPeriode(1, periode('2025-03-01', '2025-03-31')),
                ],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual([]);
        });

        test('krever at minst en periode har barn', () => {
            const resultat = validerBarnetillegg(
                true,
                [
                    barnetilleggPeriode(0, periode('2025-01-01', '2025-01-31')),
                    barnetilleggPeriode(0, periode('2025-02-01', '2025-03-31')),
                ],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual([
                'Minst en periode må ha barn når barnetillegg er valgt',
            ]);
        });

        test('godtar perioder med 0 barn så lenge en annen periode har barn', () => {
            const resultat = validerBarnetillegg(
                true,
                [
                    barnetilleggPeriode(0, periode('2025-01-01', '2025-01-31')),
                    barnetilleggPeriode(1, periode('2025-02-01', '2025-03-31')),
                ],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual([]);
        });

        test.each([
            ['starter før', periode('2024-12-31', '2025-03-31')],
            ['slutter etter', periode('2025-01-01', '2025-04-01')],
        ])('avviser en periode som %s innvilgelsen', (_, barnetilleggsperiode) => {
            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, barnetilleggsperiode)],
                innvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual([
                'Alle barnetilleggsperiodene må være innenfor en innvilgelsesperiode',
            ]);
        });

        test('godtar en periode som går over to tilstøtende innvilgelsesperioder', () => {
            const tilstøtendeInnvilgelsesperioder = [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                innvilgelsesperiode(periode('2025-02-01', '2025-03-31'), {
                    internDeltakelseId: 'deltakelse_2',
                    antallDagerPerMeldeperiode: 6,
                }),
            ];

            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, førsteKvartal)],
                tilstøtendeInnvilgelsesperioder,
                søknadMedEttBarn,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });

        test('avviser en periode som dekker hullet mellom to innvilgelsesperioder', () => {
            const innvilgelsesperioderMedHull = [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31')),
            ];

            const resultat = validerBarnetillegg(
                true,
                [barnetilleggPeriode(1, førsteKvartal)],
                innvilgelsesperioderMedHull,
                søknadMedEttBarn,
            );

            expect(resultat.errors).toEqual([
                'Alle barnetilleggsperiodene må være innenfor en innvilgelsesperiode',
            ]);
        });

        test('godtar perioder i hver sin innvilgelsesperiode når det er hull mellom innvilgelsesperiodene', () => {
            const innvilgelsesperioderMedHull = [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31')),
            ];

            const resultat = validerBarnetillegg(
                true,
                [
                    barnetilleggPeriode(1, periode('2025-01-01', '2025-01-31')),
                    barnetilleggPeriode(1, periode('2025-03-01', '2025-03-31')),
                ],
                innvilgelsesperioderMedHull,
                søknadMedEttBarn,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });
    });
});
