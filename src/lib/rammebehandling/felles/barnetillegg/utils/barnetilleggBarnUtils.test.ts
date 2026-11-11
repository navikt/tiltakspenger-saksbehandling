import { describe, expect, test } from '@jest/globals';
import {
    effektivePerioderForBarn,
    erSammeBarn,
    gyldigPeriodeForBarn,
    lagBarnKey,
    periodiserAntallBarn,
    periodiserBarnetilleggFraBarn,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { barnetilleggBarn, barnetilleggPeriode, periode } from '~test/rammebehandling';
import { tilDato } from '~/types/DatoTid';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { skjemaBarn } from '~test/barnetilleggSkjema';

const førsteHalvår = periode('2025-01-01', '2025-06-30');

describe('effektivePerioderForBarn', () => {
    test('gir hele innvilgelsesperioden for et barn med rett i hele perioden', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2015-01-01'), perioder: null }, [
                førsteHalvår,
            ]),
        ).toEqual([førsteHalvår]);
    });

    test('gir barnetillegg fra fødselsdatoen til dagen før barnet fyller 16 år', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2025-03-10'), perioder: null }, [
                førsteHalvår,
            ]),
        ).toEqual([periode('2025-03-10', '2025-06-30')]);

        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2009-03-10'), perioder: null }, [
                førsteHalvår,
            ]),
        ).toEqual([periode('2025-01-01', '2025-03-09')]);
    });

    test('avgrenser en valgt periode til innvilgelsesperiodene og perioden barnet har rett', () => {
        const innvilgelsesperioderMedHull = [
            periode('2025-01-01', '2025-01-31'),
            periode('2025-03-01', '2025-06-30'),
        ];

        expect(
            effektivePerioderForBarn(
                {
                    fødselsdato: tilDato('2009-05-15'),
                    perioder: [periode('2025-01-15', '2025-12-31')],
                },
                innvilgelsesperioderMedHull,
            ),
        ).toEqual([periode('2025-01-15', '2025-01-31'), periode('2025-03-01', '2025-05-14')]);
    });

    test('gir sorterte perioder for flere valgte perioder', () => {
        expect(
            effektivePerioderForBarn(
                {
                    fødselsdato: tilDato('2015-01-01'),
                    perioder: [
                        periode('2025-05-01', '2025-05-31'),
                        periode('2025-01-15', '2025-02-15'),
                    ],
                },
                [periode('2025-01-01', '2025-01-31'), periode('2025-02-10', '2025-06-30')],
            ),
        ).toEqual([
            periode('2025-01-15', '2025-01-31'),
            periode('2025-02-10', '2025-02-15'),
            periode('2025-05-01', '2025-05-31'),
        ]);
    });

    test('gir ingen perioder når barnet ikke har rett i innvilgelsesperioden', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2008-01-01'), perioder: null }, [
                førsteHalvår,
            ]),
        ).toEqual([]);
    });
});

describe('periodiserAntallBarn', () => {
    test('teller barna per dag, slår sammen like perioder og utelater perioder uten barn', () => {
        expect(
            periodiserAntallBarn([
                [periode('2025-01-01', '2025-01-31'), periode('2025-04-01', '2025-04-30')],
                [periode('2025-01-15', '2025-01-31')],
                [periode('2025-02-01', '2025-02-28')],
            ]),
        ).toEqual([
            barnetilleggPeriode(1, periode('2025-01-01', '2025-01-14')),
            barnetilleggPeriode(2, periode('2025-01-15', '2025-01-31')),
            barnetilleggPeriode(1, periode('2025-02-01', '2025-02-28')),
            barnetilleggPeriode(1, periode('2025-04-01', '2025-04-30')),
        ]);
    });
});

describe('periodiserBarnetilleggFraBarn', () => {
    test('periodiserer antall barn fra barnas fødselsdatoer og valgte perioder, og hopper over sladdede barn', () => {
        expect(
            periodiserBarnetilleggFraBarn(
                [
                    barnetilleggBarn('2015-01-01'),
                    barnetilleggBarn('2009-05-15'),
                    barnetilleggBarn('2020-01-01', {
                        perioder: [periode('2025-06-01', '2025-06-30')],
                    }),
                    barnetilleggBarn('2020-01-01', { fødselsdato: sladdet }),
                ],
                [førsteHalvår],
            ),
        ).toEqual([
            barnetilleggPeriode(2, periode('2025-01-01', '2025-05-14')),
            barnetilleggPeriode(1, periode('2025-05-15', '2025-05-31')),
            barnetilleggPeriode(2, periode('2025-06-01', '2025-06-30')),
        ]);
    });
});

describe('gyldigPeriodeForBarn', () => {
    test('er innvilgelsesperioden avgrenset til perioden barnet har rett', () => {
        expect(
            gyldigPeriodeForBarn(barnetilleggBarn('2025-03-10'), [
                periode('2025-01-01', '2025-01-31'),
                periode('2025-03-01', '2025-06-30'),
            ]),
        ).toEqual(periode('2025-03-10', '2025-06-30'));
    });

    test('er null når barnet ikke har rett i innvilgelsesperioden', () => {
        expect(gyldigPeriodeForBarn(barnetilleggBarn('2008-01-01'), [førsteHalvår])).toBeNull();
    });
});

describe('lagBarnKey', () => {
    test('identifiserer barnet med fnr, eller med fødselsdato og navn uavhengig av store bokstaver og mellomrom', () => {
        expect(
            lagBarnKey(barnetilleggBarn('2020-01-01', { fnr: ikkeSladdet('01012012345') }), 'x'),
        ).toBe(
            lagBarnKey(barnetilleggBarn('2021-01-01', { fnr: ikkeSladdet('01012012345') }), 'y'),
        );

        expect(
            lagBarnKey(barnetilleggBarn('2020-01-01', { fornavn: ikkeSladdet(' barn ') }), 'x'),
        ).toBe(lagBarnKey(barnetilleggBarn('2020-01-01'), 'y'));

        expect(lagBarnKey(barnetilleggBarn('2020-01-01'), 'x')).not.toBe(
            lagBarnKey(barnetilleggBarn('2020-01-02'), 'x'),
        );
    });

    test('bruker reservenøkkelen når identiteten er sladdet', () => {
        expect(lagBarnKey(barnetilleggBarn('2020-01-01', { fornavn: sladdet }), 'reserve')).toBe(
            'sladdet:reserve',
        );
    });
});

describe('erSammeBarn', () => {
    const utenFnr = skjemaBarn('2020-01-01');
    const medFnr = skjemaBarn('2020-01-01', {
        fnr: ikkeSladdet('01012012345'),
        fornavn: ikkeSladdet(' BARN '),
    });

    test('er samme barn når bare ett av barna har fnr, og fødselsdato og navn er like', () => {
        expect(utenFnr.key).not.toBe(medFnr.key);
        expect(erSammeBarn(utenFnr, medFnr)).toBe(true);
        expect(erSammeBarn(utenFnr, skjemaBarn('2020-01-02'))).toBe(false);
    });

    test('er samme barn med ulikt fnr når fødselsdato og navn er like', () => {
        const annetFnr = skjemaBarn('2020-01-01', { fnr: ikkeSladdet('01012054321') });

        expect(erSammeBarn(medFnr, annetFnr)).toBe(true);
        expect(
            erSammeBarn(annetFnr, skjemaBarn('2020-01-02', { fnr: ikkeSladdet('02012012345') })),
        ).toBe(false);
        expect(
            erSammeBarn(
                annetFnr,
                skjemaBarn('2020-01-01', {
                    fnr: ikkeSladdet('01012012345'),
                    fornavn: ikkeSladdet('Kari'),
                }),
            ),
        ).toBe(false);
    });

    test('er ikke samme barn med ulikt fnr når navnet mangler', () => {
        const utenNavn = { fornavn: ikkeSladdet(null), etternavn: ikkeSladdet(null) };

        expect(
            erSammeBarn(
                skjemaBarn('2020-01-01', { ...utenNavn, fnr: ikkeSladdet('01012012345') }),
                skjemaBarn('2020-01-01', { ...utenNavn, fnr: ikkeSladdet('01012054321') }),
            ),
        ).toBe(false);
    });

    test('er ikke samme barn når identiteten er sladdet', () => {
        expect(erSammeBarn(utenFnr, skjemaBarn('2020-01-01', { fnr: sladdet }))).toBe(false);
    });
});
