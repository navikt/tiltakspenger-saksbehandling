import { describe, expect, test } from '@jest/globals';
import { isNonNullish, isValueInRecord, nonNullish } from '~/utils/object';

enum Farge {
    RØD = 'RØD_VERDI',
    BLÅ = 'BLÅ_VERDI',
}

describe('isValueInRecord', () => {
    test('sjekker mot verdiene, ikke nøklene', () => {
        expect(isValueInRecord('RØD_VERDI', Farge)).toBe(true);
        expect(isValueInRecord('RØD', Farge)).toBe(false);
    });

    test('ukjente verdier og andre typer gir false', () => {
        expect(isValueInRecord('GRØNN_VERDI', Farge)).toBe(false);
        expect(isValueInRecord(undefined, Farge)).toBe(false);
        expect(isValueInRecord(null, Farge)).toBe(false);
        expect(isValueInRecord(1, { a: '1' })).toBe(false);
    });
});

describe('isNonNullish', () => {
    test('bare null og undefined regnes som manglende', () => {
        expect(isNonNullish(null)).toBe(false);
        expect(isNonNullish(undefined)).toBe(false);
        expect(isNonNullish(0)).toBe(true);
        expect(isNonNullish('')).toBe(true);
        expect(isNonNullish(false)).toBe(true);
        expect(isNonNullish(NaN)).toBe(true);
    });
});

describe('nonNullish', () => {
    test('returnerer falsy verdier som ikke er null eller undefined', () => {
        expect(nonNullish(0)).toBe(0);
        expect(nonNullish('')).toBe('');
        expect(nonNullish(false)).toBe(false);
    });

    test('kaster med standardmelding og verdien', () => {
        expect(() => nonNullish(null)).toThrow(
            'Verdien kan ikke være null eller undefined (verdi: null)',
        );
        expect(() => nonNullish(undefined)).toThrow('(verdi: undefined)');
    });

    test('kaster med egen melding', () => {
        expect(() => nonNullish(undefined, 'Fant ikke saken')).toThrow(
            'Fant ikke saken (verdi: undefined)',
        );
    });
});
