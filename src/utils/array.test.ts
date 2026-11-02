import { describe, expect, test } from '@jest/globals';
import { removeDuplicatesFilter } from '~/utils/array';

describe('removeDuplicatesFilter', () => {
    test('fjerner duplikate primitive verdier og beholder første forekomst', () => {
        expect([3, 1, 3, 2, 1].filter(removeDuplicatesFilter())).toEqual([3, 1, 2]);
    });

    test('uten predikat sammenlignes objekter på referanse', () => {
        const a = { id: 1 };
        const kopiAvA = { id: 1 };

        expect([a, kopiAvA, a].filter(removeDuplicatesFilter())).toEqual([a, kopiAvA]);
    });

    test('med predikat beholdes første element av hver likhetsgruppe', () => {
        const elementer = [
            { id: 'a', nr: 1 },
            { id: 'b', nr: 2 },
            { id: 'a', nr: 3 },
        ];

        expect(elementer.filter(removeDuplicatesFilter((x, y) => x.id === y.id))).toEqual([
            { id: 'a', nr: 1 },
            { id: 'b', nr: 2 },
        ]);
    });

    test('tom liste gir tom liste', () => {
        expect([].filter(removeDuplicatesFilter())).toEqual([]);
    });
});
