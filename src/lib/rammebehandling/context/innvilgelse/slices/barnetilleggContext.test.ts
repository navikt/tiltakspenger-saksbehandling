import { describe, expect, test } from '@jest/globals';
import { innvilgelsesperiode, periode } from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { InnvilgelseMedPerioderState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { barnetilleggReducer } from '~/lib/rammebehandling/context/innvilgelse/slices/barnetilleggContext';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';
import { tilDato } from '~/types/DatoTid';

const state = (
    valgteBarn: InnvilgelseMedPerioderState['valgteBarn'],
    manueltLagtTilBarn: InnvilgelseMedPerioderState['manueltLagtTilBarn'] = [],
): InnvilgelseMedPerioderState => ({
    harValgtPeriode: true,
    innvilgelsesperioder: [
        innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
        innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
    ],
    harBarnetillegg: valgteBarn.length > 0,
    valgteBarn,
    manueltLagtTilBarn,
});

const barn = skjemaBarn('2020-01-01', { fornavn: { erSladdet: false, verdi: 'Første' } });
const annetBarn = skjemaBarn('2021-01-01', { fornavn: { erSladdet: false, verdi: 'Andre' } });
// Fyller 16 år 1. mars 2025, midt i innvilgelsen
const barnSomFyller16 = skjemaBarn('2009-03-01');
const manueltBarn = skjemaBarn('2022-01-01', {
    kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
    søknadId: null,
});

describe('barnetilleggReducer', () => {
    test('setHarSøktBarnetillegg endrer valget uten å fjerne valgte barn', () => {
        expect(
            barnetilleggReducer(state([barn]), {
                type: 'setHarSøktBarnetillegg',
                payload: { harSøkt: false },
            }),
        ).toEqual({ ...state([barn]), harBarnetillegg: false });
    });

    describe('velgBarnetilleggBarn', () => {
        test('legger til barnet når det velges, og fjerner det når det velges bort', () => {
            const medBarn = barnetilleggReducer(state([barn]), {
                type: 'velgBarnetilleggBarn',
                payload: { barn: annetBarn, valgt: true },
            });
            expect(medBarn.valgteBarn).toEqual([barn, annetBarn]);

            const utenBarn = barnetilleggReducer(medBarn, {
                type: 'velgBarnetilleggBarn',
                payload: { barn, valgt: false },
            });
            expect(utenBarn.valgteBarn).toEqual([annetBarn]);
        });

        test('velger ikke samme barn to ganger', () => {
            expect(
                barnetilleggReducer(state([barn]), {
                    type: 'velgBarnetilleggBarn',
                    payload: { barn, valgt: true },
                }).valgteBarn,
            ).toEqual([barn]);
        });
    });

    test('settValgteBarnetilleggBarn erstatter barna og setter om det er barnetillegg', () => {
        const utenBarn = barnetilleggReducer(state([barn]), {
            type: 'settValgteBarnetilleggBarn',
            payload: { barn: [] },
        });
        expect(utenBarn).toMatchObject({ harBarnetillegg: false, valgteBarn: [] });

        expect(
            barnetilleggReducer(utenBarn, {
                type: 'settValgteBarnetilleggBarn',
                payload: { barn: [annetBarn] },
            }),
        ).toMatchObject({ harBarnetillegg: true, valgteBarn: [annetBarn] });
    });

    describe('settBarnetilleggPeriodevalg', () => {
        test('velger perioden barnet har rett innenfor innvilgelsen når perioden skal overstyres', () => {
            expect(
                barnetilleggReducer(state([barnSomFyller16]), {
                    type: 'settBarnetilleggPeriodevalg',
                    payload: { key: barnSomFyller16.key, heleInnvilgelsesperioden: false },
                }).valgteBarn,
            ).toEqual([{ ...barnSomFyller16, perioder: [periode('2025-01-01', '2025-02-28')] }]);
        });

        test('fjerner den overstyrte perioden når hele innvilgelsesperioden velges', () => {
            const overstyrt = { ...barn, perioder: [periode('2025-02-01', '2025-02-28')] };

            expect(
                barnetilleggReducer(state([overstyrt]), {
                    type: 'settBarnetilleggPeriodevalg',
                    payload: { key: barn.key, heleInnvilgelsesperioden: true },
                }).valgteBarn,
            ).toEqual([barn]);
        });

        test('feiler for barn som ikke er valgt', () => {
            expect(() =>
                barnetilleggReducer(state([barn]), {
                    type: 'settBarnetilleggPeriodevalg',
                    payload: { key: annetBarn.key, heleInnvilgelsesperioden: false },
                }),
            ).toThrow();
        });
    });

    describe('perioder for barnet', () => {
        const medPerioder = (...perioder: ReturnType<typeof periode>[]) => ({ ...barn, perioder });

        test('oppdaterBarnetilleggBarnPeriode oppdaterer kun barnet og perioden som endres', () => {
            expect(
                barnetilleggReducer(
                    state([medPerioder(periode('2025-02-01', '2025-02-28')), annetBarn]),
                    {
                        type: 'oppdaterBarnetilleggBarnPeriode',
                        payload: {
                            key: barn.key,
                            index: 0,
                            periodeOppdatering: { tilOgMed: tilDato('2025-05-31') },
                        },
                    },
                ).valgteBarn,
            ).toEqual([medPerioder(periode('2025-02-01', '2025-05-31')), annetBarn]);
        });

        test('oppdaterBarnetilleggBarnPeriode justerer og fjerner perioder som overlappes', () => {
            const barnMedTrePerioder = medPerioder(
                periode('2025-01-01', '2025-01-31'),
                periode('2025-03-01', '2025-03-31'),
                periode('2025-05-01', '2025-05-31'),
            );

            expect(
                barnetilleggReducer(state([barnMedTrePerioder]), {
                    type: 'oppdaterBarnetilleggBarnPeriode',
                    payload: {
                        key: barn.key,
                        index: 0,
                        periodeOppdatering: { tilOgMed: tilDato('2025-05-15') },
                    },
                }).valgteBarn,
            ).toEqual([
                medPerioder(
                    periode('2025-01-01', '2025-05-15'),
                    periode('2025-05-16', '2025-05-31'),
                ),
            ]);
        });

        test('leggTilBarnetilleggBarnPeriode legger til en periode etter den siste', () => {
            expect(
                barnetilleggReducer(state([medPerioder(periode('2025-01-01', '2025-02-28'))]), {
                    type: 'leggTilBarnetilleggBarnPeriode',
                    payload: { key: barn.key },
                }).valgteBarn,
            ).toEqual([
                medPerioder(
                    periode('2025-01-01', '2025-02-28'),
                    periode('2025-03-01', '2025-06-30'),
                ),
            ]);
        });

        test('leggTilBarnetilleggBarnPeriode avkorter den siste perioden når den slutter med innvilgelsen', () => {
            expect(
                barnetilleggReducer(state([medPerioder(periode('2025-01-01', '2025-06-30'))]), {
                    type: 'leggTilBarnetilleggBarnPeriode',
                    payload: { key: barn.key },
                }).valgteBarn,
            ).toEqual([
                medPerioder(
                    periode('2025-01-01', '2025-06-29'),
                    periode('2025-06-30', '2025-06-30'),
                ),
            ]);
        });

        test('fjernBarnetilleggBarnPeriode fjerner perioden, men ikke den siste', () => {
            const medToPerioder = medPerioder(
                periode('2025-01-01', '2025-01-31'),
                periode('2025-03-01', '2025-03-31'),
            );

            const medEnPeriode = barnetilleggReducer(state([medToPerioder]), {
                type: 'fjernBarnetilleggBarnPeriode',
                payload: { key: barn.key, index: 0 },
            });
            expect(medEnPeriode.valgteBarn).toEqual([
                medPerioder(periode('2025-03-01', '2025-03-31')),
            ]);

            expect(() =>
                barnetilleggReducer(medEnPeriode, {
                    type: 'fjernBarnetilleggBarnPeriode',
                    payload: { key: barn.key, index: 0 },
                }),
            ).toThrow();
        });
    });

    describe('manuelt lagt til barn', () => {
        test('legges til som valgt, og kan velges bort uten å forsvinne fra skjemaet', () => {
            const medManueltBarn = barnetilleggReducer(state([barn]), {
                type: 'leggTilManueltBarnetilleggBarn',
                payload: { barn: manueltBarn },
            });
            expect(medManueltBarn).toMatchObject({
                valgteBarn: [barn, manueltBarn],
                manueltLagtTilBarn: [manueltBarn],
            });

            expect(
                barnetilleggReducer(medManueltBarn, {
                    type: 'velgBarnetilleggBarn',
                    payload: { barn: manueltBarn, valgt: false },
                }),
            ).toMatchObject({ valgteBarn: [barn], manueltLagtTilBarn: [manueltBarn] });
        });

        test('kan ikke legge til et barn som allerede finnes', () => {
            expect(() =>
                barnetilleggReducer(state([manueltBarn]), {
                    type: 'leggTilManueltBarnetilleggBarn',
                    payload: { barn: manueltBarn },
                }),
            ).toThrow();
        });

        test('fjernes fra både valgte og manuelt lagt til barn', () => {
            expect(
                barnetilleggReducer(state([barn, manueltBarn], [manueltBarn]), {
                    type: 'fjernManueltBarnetilleggBarn',
                    payload: { key: manueltBarn.key },
                }),
            ).toMatchObject({ valgteBarn: [barn], manueltLagtTilBarn: [] });
        });
    });
});
