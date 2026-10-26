import { describe, expect, test } from '@jest/globals';
import { innvilgelsesperiode, periode } from '~test/rammebehandling';
import {
    InnvilgelseMedPerioderState,
    innvilgelseReducer,
    InnvilgelseUtenPerioderState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';

const utenPerioderState: InnvilgelseUtenPerioderState = {
    harValgtPeriode: false,
    innvilgelsesperioder: [{ periode: {} }],
};

const medPerioderState: InnvilgelseMedPerioderState = {
    harValgtPeriode: true,
    innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
    harBarnetillegg: false,
    barnetilleggPerioder: [],
};

describe('innvilgelseReducer', () => {
    test('sender innvilgelsesperiode-actions videre', () => {
        expect(
            innvilgelseReducer(medPerioderState, {
                type: 'settAntallDager',
                payload: { antallDager: 6, index: 0 },
            }).innvilgelsesperioder,
        ).toEqual([
            innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                antallDagerPerMeldeperiode: 6,
            }),
        ]);
    });

    test('sender barnetillegg-actions videre', () => {
        expect(
            innvilgelseReducer(medPerioderState, {
                type: 'setHarSøktBarnetillegg',
                payload: { harSøkt: true },
            }),
        ).toEqual({ ...medPerioderState, harBarnetillegg: true });
    });

    test('kaster feil for barnetillegg-actions før innvilgelsesperioden er valgt', () => {
        expect(() =>
            innvilgelseReducer(utenPerioderState, {
                type: 'setHarSøktBarnetillegg',
                payload: { harSøkt: true },
            }),
        ).toThrow();
    });
});
