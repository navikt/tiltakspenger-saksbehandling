import { describe, expect, test } from '@jest/globals';
import { formatterBeløp } from './beløpUtils';

// Intl bruker hardt mellomrom og minustegn (U+2212), og plasseringen av «kr» varierer med ICU-versjonen
const normaliser = (tekst: string) => tekst.replace(/\s/g, ' ').replace(/\u2212/g, '-');

describe('formatterBeløp', () => {
    test('hele kroner vises i kroner uten desimaler og med tusenskille', () => {
        const formatert = normaliser(formatterBeløp(12345));

        expect(formatert).toContain('12 345');
        expect(formatert).toContain('kr');
        expect(formatert).not.toContain(',');
    });

    test('øre vises med to desimaler', () => {
        expect(normaliser(formatterBeløp(1234.5))).toContain('1 234,50');
    });

    test('negative beløp får minustegn', () => {
        expect(normaliser(formatterBeløp(-500))).toMatch(/^-/);
    });

    test('formatet kan overstyres', () => {
        expect(normaliser(formatterBeløp(1234.5, { style: 'decimal' }))).toBe('1 234,5');
    });
});
