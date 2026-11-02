import { describe, expect, test } from '@jest/globals';
import {
    benkFilterTilQuery,
    benkStrengVerdi,
    harBenkFilterVerdier,
    parseBenkSide,
} from './benkQuery';

describe('parseBenkSide', () => {
    test('gyldige sidetall leses fra url-en', () => {
        expect(parseBenkSide('0')).toBe(0);
        expect(parseBenkSide('3')).toBe(3);
    });

    test('manglende, negative, desimale og ugyldige sidetall gir første side', () => {
        expect(parseBenkSide(undefined)).toBe(0);
        expect(parseBenkSide('')).toBe(0);
        expect(parseBenkSide('-1')).toBe(0);
        expect(parseBenkSide('1.5')).toBe(0);
        expect(parseBenkSide('abc')).toBe(0);
        expect(parseBenkSide(['2', '3'])).toBe(0);
    });
});

describe('benkStrengVerdi', () => {
    test('bare ikke-tomme strenger godtas, også når query-parameteren er gjentatt', () => {
        expect(benkStrengVerdi('Z123456')).toBe('Z123456');
        expect(benkStrengVerdi('')).toBeNull();
        expect(benkStrengVerdi(['a', 'b'])).toBeNull();
        expect(benkStrengVerdi(true)).toBeNull();
    });
});

describe('filterverdier', () => {
    test('filteret har verdier bare når noe er valgt', () => {
        expect(harBenkFilterVerdier({ status: null, skjulPåVent: false, saksbehandler: '' })).toBe(
            false,
        );
        expect(harBenkFilterVerdier({ status: null, skjulPåVent: true })).toBe(true);
        expect(harBenkFilterVerdier({ status: 'UNDER_BEHANDLING' })).toBe(true);
    });

    test('valgte avkrysninger og verdier serialiseres som strenger', () => {
        expect(
            benkFilterTilQuery({
                status: 'UNDER_BEHANDLING',
                skjulPåVent: true,
                kunTildeltMeg: false,
                saksbehandler: null,
            }),
        ).toEqual({ status: 'UNDER_BEHANDLING', skjulPåVent: 'true' });
    });
});
