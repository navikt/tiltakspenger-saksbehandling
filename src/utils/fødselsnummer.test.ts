import { describe, expect, test } from '@jest/globals';
import { erFødselsnummer } from '~/utils/fødselsnummer';

describe('erFødselsnummer', () => {
    test('sann for 11 siffer', () => {
        expect(erFødselsnummer('12345678901')).toBe(true);
    });

    test('usann for en sladdet verdi', () => {
        expect(erFødselsnummer('[Sladdet]')).toBe(false);
    });

    test('usann for tom streng', () => {
        expect(erFødselsnummer('')).toBe(false);
    });

    test('usann for 10 siffer', () => {
        expect(erFødselsnummer('1234567890')).toBe(false);
    });
});
