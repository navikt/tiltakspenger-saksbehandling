import { describe, expect, test } from '@jest/globals';
import { getNavnMedFødselsdato } from '~/lib/søknad/manuell-søknad/barnetillegg/barnetilleggUtils';

const barn = { fornavn: 'Ola', etternavn: 'Nordmann', fødselsdato: '2020-05-05' };

describe('getNavnMedFødselsdato', () => {
    test('viser navn og fødselsdato', () => {
        expect(getNavnMedFødselsdato(barn, false)).toBe('Ola Nordmann - født 05.05.2020');
    });

    test('skjuler navnet for barn med adressebeskyttelse', () => {
        expect(getNavnMedFødselsdato(barn, true)).toBe(
            'Barn med adressebeskyttelse - født 05.05.2020',
        );
    });

    test('viser ukjent fødselsdato når den mangler', () => {
        expect(getNavnMedFødselsdato({ ...barn, fødselsdato: '' }, false)).toBe(
            'Ola Nordmann - født ukjent',
        );
    });
});
