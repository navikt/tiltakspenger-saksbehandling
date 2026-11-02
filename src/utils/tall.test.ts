import { describe, expect, test } from '@jest/globals';
import { minOgMax, numberRangeToString } from '~/utils/tall';

describe('minOgMax', () => {
    test('finner minste og største tall uavhengig av rekkefølgen', () => {
        expect(minOgMax([3, 1, 5, 2])).toEqual({ min: 1, max: 5 });
    });

    test('ett tall gir samme min og max', () => {
        expect(minOgMax([4])).toEqual({ min: 4, max: 4 });
    });

    test('håndterer negative tall og null', () => {
        expect(minOgMax([0, -2, 7])).toEqual({ min: -2, max: 7 });
    });

    test('kaster for en tom liste, i stedet for å gi Infinity', () => {
        expect(() => minOgMax([])).toThrow('Må ha minst ett tall');
    });
});

describe('numberRangeToString', () => {
    test('viser ett tall når min og max er like', () => {
        expect(numberRangeToString({ min: 2, max: 2 })).toBe('2');
    });

    test('viser et intervall når min og max er ulike', () => {
        expect(numberRangeToString({ min: 1, max: 3 })).toBe('1 - 3');
    });

    test('viser 0 for et tomt intervall', () => {
        expect(numberRangeToString({ min: 0, max: 0 })).toBe('0');
    });
});
