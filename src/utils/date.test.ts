import { describe, expect, test } from '@jest/globals';
import { erGyldigDatotekst, formaterDatotekst } from '~/utils/date';

const SLADDET = '[Sladdet]';

describe('formaterDatotekst', () => {
    test('formaterer en gyldig ISO-dato som DD.MM.YYYY', () => {
        expect(formaterDatotekst('2025-03-09')).toBe('09.03.2025');
    });

    test('gir ukjent for tom verdi', () => {
        expect(formaterDatotekst('')).toBe('ukjent');
    });

    test('returnerer teksten uendret når den ikke er en gyldig dato', () => {
        expect(formaterDatotekst(SLADDET)).toBe(SLADDET);
    });
});

describe('erGyldigDatotekst', () => {
    test('sann for en ISO-dato', () => {
        expect(erGyldigDatotekst('2025-03-09')).toBe(true);
    });

    test('usann for en sladdet verdi', () => {
        expect(erGyldigDatotekst(SLADDET)).toBe(false);
    });
});
