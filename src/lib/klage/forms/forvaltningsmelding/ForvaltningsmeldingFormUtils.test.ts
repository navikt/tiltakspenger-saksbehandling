import { describe, expect, test } from '@jest/globals';
import {
    forvaltningsmeldingFormValidation,
    inneholderPlassholder,
    standardtekstForvaltningsmelding,
} from './ForvaltningsmeldingFormUtils';

describe('inneholderPlassholder', () => {
    test.each(['ca. X måneder', 'X uker', 'innen X.', '(X)', 'X'])(
        'finner plassholder i «%s»',
        (tekst) => {
            expect(inneholderPlassholder(tekst)).toBe(true);
        },
    );

    test.each(['ca. 4 måneder', 'Xavier', 'XML', 'TaX', 'ca. x måneder'])(
        'finner ikke plassholder i «%s»',
        (tekst) => {
            expect(inneholderPlassholder(tekst)).toBe(false);
        },
    );
});

describe('forvaltningsmeldingFormValidation', () => {
    test('avviser standardteksten fordi den inneholder X', () => {
        const { errors } = forvaltningsmeldingFormValidation(standardtekstForvaltningsmelding());

        expect(errors.tekstfelter?.[0]?.tekst?.message).toBe(
            'Bytt ut X med antall måneder eller uker',
        );
        expect(errors.tekstfelter?.[1]?.tekst?.message).toBe(
            'Bytt ut X med antall måneder eller uker',
        );
    });

    test('godtar tekst uten plassholder', () => {
        const data = {
            tekstfelter: standardtekstForvaltningsmelding().tekstfelter.map((avsnitt) => ({
                ...avsnitt,
                tekst: avsnitt.tekst.replaceAll(' X ', ' 4 '),
            })),
        };

        expect(forvaltningsmeldingFormValidation(data).errors).toEqual({});
    });

    test('tom tekst gir tom-feilen, ikke plassholderfeilen', () => {
        const { errors } = forvaltningsmeldingFormValidation({
            tekstfelter: [{ tittel: 'X', tekst: '' }],
        });

        expect(errors.tekstfelter?.[0]?.tittel?.message).toBe(
            'Bytt ut X med antall måneder eller uker',
        );
        expect(errors.tekstfelter?.[0]?.tekst?.message).toBe('Avsnittet kan ikke være tomt');
    });
});
