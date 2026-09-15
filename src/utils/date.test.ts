import { describe, expect, test } from '@jest/globals';
import { formaterDatotekst, formaterSladdbarDatotekst } from '~/utils/date';
import { SLADDET_TEKST_DEFAULT } from '~/utils/sladdetVerdi';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';

describe('formaterDatotekst', () => {
    test('formaterer en gyldig ISO-dato som DD.MM.YYYY', () => {
        expect(formaterDatotekst('2025-03-09')).toBe('09.03.2025');
    });

    test('gir ukjent for tom verdi', () => {
        expect(formaterDatotekst('')).toBe('ukjent');
    });
});

describe('formaterSladdbarDatotekst', () => {
    test('formaterer en verdi som ikke er sladdet', () => {
        expect(formaterSladdbarDatotekst(ikkeSladdet('2025-03-09'))).toBe('09.03.2025');
    });

    test('viser sladdet tekst for en sladdet verdi', () => {
        expect(formaterSladdbarDatotekst(sladdet)).toBe(SLADDET_TEKST_DEFAULT);
    });
});
