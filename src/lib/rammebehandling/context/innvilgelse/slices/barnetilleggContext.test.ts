import { describe, expect, test } from '@jest/globals';
import { barnetilleggPeriode, innvilgelsesperiode, periode } from '~test/rammebehandling';
import { InnvilgelseMedPerioderState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { barnetilleggReducer } from '~/lib/rammebehandling/context/innvilgelse/slices/barnetilleggContext';

const state = (
    barnetilleggPerioder: InnvilgelseMedPerioderState['barnetilleggPerioder'],
): InnvilgelseMedPerioderState => ({
    harValgtPeriode: true,
    innvilgelsesperioder: [
        innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
        innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
    ],
    harBarnetillegg: barnetilleggPerioder.length > 0,
    barnetilleggPerioder,
});

const toPerioder = [
    barnetilleggPeriode(1, periode('2025-01-01', '2025-03-31')),
    barnetilleggPeriode(2, periode('2025-04-01', '2025-06-30')),
];

describe('barnetilleggReducer', () => {
    test('setHarSøktBarnetillegg endrer valget uten å fjerne periodene', () => {
        expect(
            barnetilleggReducer(state(toPerioder), {
                type: 'setHarSøktBarnetillegg',
                payload: { harSøkt: false },
            }),
        ).toEqual({ ...state(toPerioder), harBarnetillegg: false });
    });

    describe('addBarnetilleggPeriode', () => {
        test('dekker hele innvilgelsen når det ikke finnes perioder fra før', () => {
            expect(
                barnetilleggReducer(state([]), {
                    type: 'addBarnetilleggPeriode',
                    payload: { antallBarn: 2 },
                }).barnetilleggPerioder,
            ).toEqual([barnetilleggPeriode(2, periode('2025-01-01', '2025-06-30'))]);
        });

        test('starter dagen etter forrige periode og varer ut innvilgelsen', () => {
            const forrige = barnetilleggPeriode(1, periode('2025-01-01', '2025-03-31'));

            expect(
                barnetilleggReducer(state([forrige]), {
                    type: 'addBarnetilleggPeriode',
                    payload: { antallBarn: 3 },
                }).barnetilleggPerioder,
            ).toEqual([forrige, barnetilleggPeriode(3, periode('2025-04-01', '2025-06-30'))]);
        });
    });

    test('fjernBarnetilleggPeriode fjerner valgt periode', () => {
        expect(
            barnetilleggReducer(state(toPerioder), {
                type: 'fjernBarnetilleggPeriode',
                payload: { index: 0 },
            }).barnetilleggPerioder,
        ).toEqual([toPerioder[1]]);
    });

    test.each([
        { perioder: toPerioder, harBarnetillegg: true },
        { perioder: [], harBarnetillegg: false },
    ])(
        'settBarnetilleggPerioder setter harBarnetillegg=$harBarnetillegg ut fra periodene',
        ({ perioder, harBarnetillegg }) => {
            const fraState = state(perioder.length > 0 ? [] : toPerioder);

            expect(
                barnetilleggReducer(fraState, {
                    type: 'settBarnetilleggPerioder',
                    payload: { barnetilleggPerioder: perioder },
                }),
            ).toEqual({ ...fraState, barnetilleggPerioder: perioder, harBarnetillegg });
        },
    );

    test('oppdaterBarnetilleggAntall endrer antall barn for valgt periode', () => {
        expect(
            barnetilleggReducer(state(toPerioder), {
                type: 'oppdaterBarnetilleggAntall',
                payload: { antall: 4, index: 1 },
            }).barnetilleggPerioder,
        ).toEqual([toPerioder[0], barnetilleggPeriode(4, periode('2025-04-01', '2025-06-30'))]);
    });

    test('oppdaterBarnetilleggPeriode justerer andre perioder slik at de ikke overlapper', () => {
        expect(
            barnetilleggReducer(state(toPerioder), {
                type: 'oppdaterBarnetilleggPeriode',
                payload: { periodeOppdatering: { tilOgMed: '2025-04-30' }, index: 0 },
            }).barnetilleggPerioder,
        ).toEqual([
            barnetilleggPeriode(1, periode('2025-01-01', '2025-04-30')),
            barnetilleggPeriode(2, periode('2025-05-01', '2025-06-30')),
        ]);
    });
});
