import { describe, expect, test } from '@jest/globals';
import {
    effektivePerioderForBarn,
    gyldigPeriodeForBarn,
    lagBarnKey,
    periodiserAntallBarn,
    periodiserBarnetilleggFraBarn,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { barnetilleggBarn, barnetilleggPeriode, periode } from '~test/rammebehandling';
import { tilDato } from '~/types/DatoTid';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';

const førsteHalvår = periode('2025-01-01', '2025-06-30');

describe('effektivePerioderForBarn', () => {
    test('gir hele innvilgelsesperioden for et barn med rett i hele perioden', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2015-01-01'), periode: null }, [
                førsteHalvår,
            ]),
        ).toEqual([førsteHalvår]);
    });

    test('gir barnetillegg fra fødselsdatoen til dagen før barnet fyller 16 år', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2025-03-10'), periode: null }, [
                førsteHalvår,
            ]),
        ).toEqual([periode('2025-03-10', '2025-06-30')]);

        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2009-03-10'), periode: null }, [
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
                    periode: periode('2025-01-15', '2025-12-31'),
                },
                innvilgelsesperioderMedHull,
            ),
        ).toEqual([periode('2025-01-15', '2025-01-31'), periode('2025-03-01', '2025-05-14')]);
    });

    test('gir ingen perioder når barnet ikke har rett i innvilgelsesperioden', () => {
        expect(
            effektivePerioderForBarn({ fødselsdato: tilDato('2008-01-01'), periode: null }, [
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
                        periode: periode('2025-06-01', '2025-06-30'),
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
