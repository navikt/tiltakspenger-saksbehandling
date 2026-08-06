import { describe, expect, test } from '@jest/globals';
import {
    Posteringstype,
    Simuleringsmerke,
    Simuleringspostering,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { tilKompakteMerker, tilVisbarePosteringer } from './simuleringsmerker';

const merke = (overstyringer: Partial<Simuleringsmerke>): Simuleringsmerke => ({
    type: Posteringstype.YTELSE,
    periodeFraOgMed: '2025-01-06',
    periodeTilOgMed: '2025-01-06',
    klassekode: 'TPTPAFT',
    beløp: 298,
    erJustering: false,
    erNegativt: false,
    ...overstyringer,
});

const postering = (overstyringer: Partial<Simuleringspostering>): Simuleringspostering => ({
    type: Posteringstype.YTELSE,
    periodeFraOgMed: '2025-01-06',
    periodeTilOgMed: '2025-01-10',
    klassekode: 'TPTPAFT',
    beløp: 298,
    erJustering: false,
    ...overstyringer,
});

describe('tilKompakteMerker', () => {
    test('trekk og justering skilles på fortegn, og like merker slås sammen med antall', () => {
        const merker = tilKompakteMerker([
            merke({ type: Posteringstype.TREKK, beløp: -237, erNegativt: true }),
            merke({ type: Posteringstype.TREKK, beløp: -98, erNegativt: true }),
            merke({ type: Posteringstype.TREKK, beløp: 156 }),
            merke({
                type: Posteringstype.JUSTERING,
                erJustering: true,
                beløp: -41,
                erNegativt: true,
            }),
        ]);

        expect(merker).toEqual([
            { etikett: 'Justering\u00A0−', variant: 'info', antall: 1 },
            { etikett: 'Trekk\u00A0−', variant: 'neutral', antall: 2 },
            { etikett: 'Trekk\u00A0+', variant: 'neutral', antall: 1 },
        ]);
    });

    test('feilutbetaling med justeringsklassekode vises som justering', () => {
        const merker = tilKompakteMerker([
            merke({ type: Posteringstype.FEILUTBETALING, erJustering: true, beløp: 66 }),
        ]);

        expect(merker).toEqual([{ etikett: 'Justering\u00A0+', variant: 'info', antall: 1 }]);
    });

    test('ytelse og motpostering er normalflyten og vises ikke', () => {
        const merker = tilKompakteMerker([
            merke({ type: Posteringstype.YTELSE }),
            merke({ type: Posteringstype.MOTPOSTERING, beløp: -200 }),
        ]);

        expect(merker).toEqual([]);
    });

    test('feilutbetaling sorteres foran justering og trekk', () => {
        const merker = tilKompakteMerker([
            merke({ type: Posteringstype.TREKK, beløp: -191, erNegativt: true }),
            merke({
                type: Posteringstype.JUSTERING,
                erJustering: true,
                beløp: -41,
                erNegativt: true,
            }),
            merke({ type: Posteringstype.FEILUTBETALING, beløp: 200 }),
        ]);

        expect(merker.map(({ etikett }) => etikett)).toEqual([
            'Feilutbetaling',
            'Justering\u00A0−',
            'Trekk\u00A0−',
        ]);
    });
});

describe('tilVisbarePosteringer', () => {
    test('viser kildens beløp med fortegn og posteringens periode', () => {
        const rader = tilVisbarePosteringer([
            postering({ type: Posteringstype.JUSTERING, erJustering: true, beløp: 81 }),
        ]);

        expect(rader).toEqual([
            {
                etikett: 'Justering',
                variant: 'info',
                beløp: formatterBeløp(81, { signDisplay: 'always' }),
                periode: '06.01 - 10.01.2025',
            },
        ]);
    });

    test('ytelse og motpostering vises ikke', () => {
        const rader = tilVisbarePosteringer([
            postering({ type: Posteringstype.YTELSE }),
            postering({ type: Posteringstype.MOTPOSTERING, beløp: -200 }),
        ]);

        expect(rader).toEqual([]);
    });

    test('sorterer på periode først, deretter viktighet', () => {
        const rader = tilVisbarePosteringer([
            postering({
                type: Posteringstype.TREKK,
                beløp: -98,
                periodeFraOgMed: '2025-01-13',
                periodeTilOgMed: '2025-01-17',
            }),
            postering({ type: Posteringstype.TREKK, beløp: -237 }),
            postering({ type: Posteringstype.JUSTERING, erJustering: true, beløp: 81 }),
        ]);

        expect(rader.map(({ etikett, periode }) => `${etikett} ${periode}`)).toEqual([
            'Justering 06.01 - 10.01.2025',
            'Trekk 06.01 - 10.01.2025',
            'Trekk 13.01 - 17.01.2025',
        ]);
    });
});
