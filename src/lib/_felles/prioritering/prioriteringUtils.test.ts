import { describe, expect, test } from '@jest/globals';
import {
    prioriteringManglerBegrunnelse,
    tilOppdaterPrioriteringDTO,
} from '~/lib/_felles/prioritering/prioriteringUtils';

describe('tilOppdaterPrioriteringDTO', () => {
    test('sender begrunnelsen når behandlingen er prioritert', () => {
        expect(tilOppdaterPrioriteringDTO(true, 'Bruker står uten inntekt')).toEqual({
            begrunnelse: 'Bruker står uten inntekt',
        });
    });

    test('sender null når behandlingen ikke er prioritert, selv om begrunnelsen er utfylt', () => {
        expect(tilOppdaterPrioriteringDTO(false, 'Gammel begrunnelse')).toBeNull();
    });

    test('sender null når begrunnelsen mangler', () => {
        expect(tilOppdaterPrioriteringDTO(true, null)).toBeNull();
    });
});

describe('prioriteringManglerBegrunnelse', () => {
    test('mangler begrunnelse når behandlingen er prioritert uten begrunnelse', () => {
        expect(prioriteringManglerBegrunnelse(true, null)).toBe(true);
        expect(prioriteringManglerBegrunnelse(true, '')).toBe(true);
    });

    test('mangler ikke begrunnelse når den er utfylt eller behandlingen ikke er prioritert', () => {
        expect(prioriteringManglerBegrunnelse(true, 'Haster')).toBe(false);
        expect(prioriteringManglerBegrunnelse(false, null)).toBe(false);
    });
});
