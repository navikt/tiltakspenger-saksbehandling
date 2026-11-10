import { describe, expect, test } from '@jest/globals';
import { innvilgelsesperiode, omgjøringInnvilgelse, periode } from '~test/rammebehandling';
import { finnUgyldigTiltaksdeltakelse } from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';
import { UgyldigTiltaksdeltakelse } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';

const mars = periode('2025-03-01', '2025-03-31');

const ugyldig: UgyldigTiltaksdeltakelse = {
    type: 'DEKKER_IKKE_PERIODEN',
    deltakelsesperiode: periode('2025-01-01', '2025-02-28'),
};

const behandling = omgjøringInnvilgelse({
    innvilgelsesperioder: [
        {
            ...innvilgelsesperiode(mars, { erReversertOpphør: false }),
            ugyldigTiltaksdeltakelse: ugyldig,
        },
    ],
});

describe('finnUgyldigTiltaksdeltakelse', () => {
    test('gir feilen fra backend for den lagrede perioden', () => {
        expect(
            finnUgyldigTiltaksdeltakelse(
                behandling,
                innvilgelsesperiode(mars, { erReversertOpphør: false }),
            ),
        ).toEqual(ugyldig);
    });

    test('gir ingen feil når bare valget av reversert opphør er endret', () => {
        expect(
            finnUgyldigTiltaksdeltakelse(
                behandling,
                innvilgelsesperiode(mars, { erReversertOpphør: true }),
            ),
        ).toBeNull();
    });
});
