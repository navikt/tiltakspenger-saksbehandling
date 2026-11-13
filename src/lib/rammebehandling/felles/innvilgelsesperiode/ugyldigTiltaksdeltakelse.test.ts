import { describe, expect, test } from '@jest/globals';
import { omgjøringInnvilgelse, periode } from '~test/rammebehandling';
import { finnUgyldigTiltaksdeltakelse } from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';
import { UgyldigTiltaksdeltakelse } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';

const mars = periode('2025-03-01', '2025-03-31');

const ugyldig: UgyldigTiltaksdeltakelse = {
    type: 'DEKKER_IKKE_PERIODEN',
    deltakelsesperiode: periode('2025-01-01', '2025-02-28'),
};

const behandling = omgjøringInnvilgelse({
    innvilgelsesperioder: {
        tiltak: [
            {
                internDeltakelseId: 'deltakelse_1',
                erReversertOpphør: false,
                perioder: [{ periode: mars, ugyldigTiltaksdeltakelse: ugyldig }],
            },
        ],
        antallDagerPerMeldeperiode: [{ periode: mars, antallDagerPerMeldeperiode: 10 }],
    },
});

describe('finnUgyldigTiltaksdeltakelse', () => {
    test('gir feilen fra backend for den lagrede perioden', () => {
        expect(
            finnUgyldigTiltaksdeltakelse(
                behandling,
                { internDeltakelseId: 'deltakelse_1', erReversertOpphør: false },
                mars,
            ),
        ).toEqual(ugyldig);
    });

    test('gir ingen feil når perioden er endret', () => {
        expect(
            finnUgyldigTiltaksdeltakelse(
                behandling,
                { internDeltakelseId: 'deltakelse_1', erReversertOpphør: false },
                periode('2025-03-01', '2025-03-15'),
            ),
        ).toBeNull();
    });

    test('gir ingen feil når bare valget av reversert opphør er endret', () => {
        expect(
            finnUgyldigTiltaksdeltakelse(
                behandling,
                { internDeltakelseId: 'deltakelse_1', erReversertOpphør: true },
                mars,
            ),
        ).toBeNull();
    });
});
