import { describe, expect, test } from '@jest/globals';
import { DateValidationT } from '@navikt/ds-react';
import { datovalideringsfeil } from './datovelgerUtils';

const validering = (overrides: Partial<DateValidationT>): DateValidationT => ({
    isDisabled: false,
    isWeekend: false,
    isEmpty: false,
    isInvalid: false,
    isValidDate: false,
    isBefore: false,
    isAfter: false,
    ...overrides,
});

describe('datovalideringsfeil', () => {
    test('gyldig eller tom dato gir ingen feil', () => {
        expect(datovalideringsfeil(validering({ isValidDate: true }))).toBeUndefined();
        expect(datovalideringsfeil(validering({ isEmpty: true }), 'For tidlig')).toBeUndefined();
    });

    test('ugyldig dato gir standardfeilmeldingen', () => {
        expect(datovalideringsfeil(validering({ isInvalid: true }))).toBe(
            'Skriv inn en gyldig dato (dd.mm.åååå)',
        );
    });

    test('dato før minimumsdatoen gir egen feilmelding bare når den er oppgitt', () => {
        expect(
            datovalideringsfeil(validering({ isBefore: true }), 'Fristen må være fram i tid'),
        ).toBe('Fristen må være fram i tid');
        expect(datovalideringsfeil(validering({ isBefore: true }))).toBe(
            'Skriv inn en gyldig dato (dd.mm.åååå)',
        );
    });

    test('dato etter maksimumsdatoen gir standardfeilmeldingen', () => {
        expect(datovalideringsfeil(validering({ isAfter: true }), 'For tidlig')).toBe(
            'Skriv inn en gyldig dato (dd.mm.åååå)',
        );
    });
});
