import { describe, expect, test } from '@jest/globals';
import { utvidPeriodisering } from '~/utils/periode';
import { MedPeriode } from '~/types/Periode';

type MedAntall = MedPeriode<{ antall: number }>;

const element = (fraOgMed: string, tilOgMed: string, antall: number): MedAntall => ({
    antall,
    periode: { fraOgMed, tilOgMed },
});

describe('utvidPeriodisering', () => {
    test('tom periodisering gir tom liste', () => {
        expect(utvidPeriodisering([], { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' })).toEqual(
            [],
        );
        expect(
            utvidPeriodisering([], { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' }, true),
        ).toEqual([]);
    });

    test('uten overlapp og uten flagget for nærmeste gir tom liste', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' }),
        ).toEqual([]);
    });

    test('perioden ligger før første element og arver verdien fra det', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' },
                true,
            ),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' } }]);
    });

    test('perioden ligger etter siste element og arver verdien fra det', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-07-01', tilOgMed: '2025-07-31' },
                true,
            ),
        ).toEqual([{ antall: 2, periode: { fraOgMed: '2025-07-01', tilOgMed: '2025-07-31' } }]);
    });

    test('perioden ligger midt i et hull mellom to elementer og gir tom liste', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-10', tilOgMed: '2025-04-20' },
                true,
            ),
        ).toEqual([]);
    });

    test('perioden fyller hele hullet og tilstøter naboene uten å overlappe dem', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                true,
            ),
        ).toEqual([]);
    });

    test('overlapp med ett element gir det elementet med den nye perioden', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-03-15' }),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-03-15' } }]);
    });

    test('overlapp med flere elementer utvider bare ytterkantene', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-04-01', '2025-04-30', 2),
            element('2025-05-01', '2025-05-31', 3),
        ];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-06-30' }),
        ).toEqual([
            { antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-03-31' } },
            { antall: 2, periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' } },
            { antall: 3, periode: { fraOgMed: '2025-05-01', tilOgMed: '2025-06-30' } },
        ]);
    });

    test('en enkelt dag i hullet gir tom liste', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-15', tilOgMed: '2025-04-15' },
                true,
            ),
        ).toEqual([]);
    });

    test('periodiseringen som sendes inn endres ikke', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];
        const uendret = structuredClone(periodisering);

        utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-06-30' });
        utvidPeriodisering(periodisering, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }, true);

        expect(periodisering).toEqual(uendret);
    });

    test('perioden slutter dagen før første element og regnes som før periodiseringen', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' },
                true,
            ),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' } }]);
    });
});
