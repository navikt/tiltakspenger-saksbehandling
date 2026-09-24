import { describe, expect, test } from '@jest/globals';
import { benkSorteringNøkkel, benkSorteringQuery } from './benkSortering';

describe('sorteringen i url-en', () => {
    test('hver seksjon har sin egen nøkkel', () => {
        expect(benkSorteringNøkkel()).toBe('sortering');
        expect(benkSorteringNøkkel('KLAGE')).toBe('sortering-KLAGE');
    });

    test('tar med fanens og seksjonenes sortering, og ingenting annet', () => {
        expect(
            benkSorteringQuery({
                tab: 'MINE',
                sortering: 'fnr,ASC',
                'sortering-KLAGE': 'status,DESC',
                'sortering-MELDEKORT': '',
                sorteringer: 'ikke,med',
                skjulPåVent: 'true',
            }),
        ).toEqual({ sortering: 'fnr,ASC', 'sortering-KLAGE': 'status,DESC' });
    });
});
