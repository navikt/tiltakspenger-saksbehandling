import { describe, expect, test } from '@jest/globals';
import { resolverResultat } from '~/utils/resolverResultat';

type Skjema = { begrunnelse: string };

describe('resolverResultat', () => {
    test('uten feil returneres verdiene', () => {
        expect(resolverResultat<Skjema>({ begrunnelse: 'Tekst' }, {})).toEqual({
            values: { begrunnelse: 'Tekst' },
            errors: {},
        });
    });

    test('med feil returneres feilene og ingen verdier, slik at skjemaet ikke sendes inn', () => {
        const errors = { begrunnelse: { type: 'required', message: 'Påkrevd' } };

        expect(resolverResultat<Skjema>({ begrunnelse: '' }, errors)).toEqual({
            values: {},
            errors,
        });
    });
});
