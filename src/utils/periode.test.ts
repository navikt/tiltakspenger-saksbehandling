import { describe, expect, test } from '@jest/globals';
import {
    erDatoIPeriode,
    erFullstendigPeriode,
    finnPerioderHull,
    finnPeriodiseringHull,
    inneholderHelePerioden,
    krympPeriodisering,
    meldeperiodeKjedeIdTilPeriode,
    oppdaterPartialPeriode,
    oppdaterPeriode,
    overlappendePeriode,
    periodeTilMeldeperiodeKjedeId,
    perioderErLike,
    perioderErSammenhengende,
    perioderOverlapper,
    periodiseringerErLike,
    periodiseringTotalPeriode,
    slåSammenPerioder,
    slåSammenPeriodisering,
    sorterPerioder,
    sorterPeriodisering,
    totalPeriode,
    utvidPeriodisering,
    validerPeriodisering,
} from '~/utils/periode';
import { MedPeriode, Periode } from '~/types/Periode';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

type MedAntall = MedPeriode<{ antall: number }>;

const element = (fraOgMed: string, tilOgMed: string, antall: number): MedAntall => ({
    antall,
    periode: { fraOgMed, tilOgMed },
});

describe('utvidPeriodisering', () => {
    test('tom periodisering gir tom liste', () => {
        expect(utvidPeriodisering([], { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' })).toEqual(
            [],
        );
        expect(
            utvidPeriodisering([], { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' }, true),
        ).toEqual([]);
    });

    test('uten overlapp og uten flagget for nærmeste gir tom liste', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' }),
        ).toEqual([]);
    });

    test('perioden ligger før første element og arver verdien fra det', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' },
                true,
            ),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' } }]);
    });

    test('perioden ligger etter siste element og arver verdien fra det', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-07-01', tilOgMed: '2025-07-31' },
                true,
            ),
        ).toEqual([{ antall: 2, periode: { fraOgMed: '2025-07-01', tilOgMed: '2025-07-31' } }]);
    });

    test('perioden ligger midt i et hull mellom to elementer og gir tom liste', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-10', tilOgMed: '2025-04-20' },
                true,
            ),
        ).toEqual([]);
    });

    test('perioden fyller hele hullet og tilstøter naboene uten å overlappe dem', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                true,
            ),
        ).toEqual([]);
    });

    test('overlapp med ett element gir det elementet med den nye perioden', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-03-15' }),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-03-15' } }]);
    });

    test('overlapp med flere elementer utvider bare ytterkantene', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-04-01', '2025-04-30', 2),
            element('2025-05-01', '2025-05-31', 3),
        ];

        expect(
            utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-06-30' }),
        ).toEqual([
            { antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-03-31' } },
            { antall: 2, periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' } },
            { antall: 3, periode: { fraOgMed: '2025-05-01', tilOgMed: '2025-06-30' } },
        ]);
    });

    test('en enkelt dag i hullet gir tom liste', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-04-15', tilOgMed: '2025-04-15' },
                true,
            ),
        ).toEqual([]);
    });

    test('periodiseringen som sendes inn endres ikke', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];
        const uendret = structuredClone(periodisering);

        utvidPeriodisering(periodisering, { fraOgMed: '2025-02-01', tilOgMed: '2025-06-30' });
        utvidPeriodisering(periodisering, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }, true);

        expect(periodisering).toEqual(uendret);
    });
});

describe('meldeperiodeKjedeIdTilPeriode og periodeTilMeldeperiodeKjedeId', () => {
    test('parser kjede-id til periode', () => {
        expect(
            meldeperiodeKjedeIdTilPeriode('2025-01-06/2025-01-19' as MeldeperiodeKjedeId),
        ).toEqual({ fraOgMed: '2025-01-06', tilOgMed: '2025-01-19' });
    });

    test('konverterer periode til kjede-id', () => {
        expect(
            periodeTilMeldeperiodeKjedeId({ fraOgMed: '2025-01-06', tilOgMed: '2025-01-19' }),
        ).toBe('2025-01-06/2025-01-19');
    });

    test('roundtrip gir samme periode', () => {
        const periode: Periode = { fraOgMed: '2025-12-29', tilOgMed: '2026-01-11' };
        expect(
            meldeperiodeKjedeIdTilPeriode(
                periodeTilMeldeperiodeKjedeId(periode) as MeldeperiodeKjedeId,
            ),
        ).toEqual(periode);
    });
});

describe('validerPeriodisering', () => {
    test('tom periodisering er gyldig', () => {
        expect(validerPeriodisering([], false)).toBe(true);
        expect(validerPeriodisering([], true)).toBe(true);
    });

    test('ett element er alltid gyldig', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];
        expect(validerPeriodisering(periodisering, false)).toBe(true);
        expect(validerPeriodisering(periodisering, true)).toBe(true);
    });

    test('sammenhengende perioder er gyldige uansett hull-flagg', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-04-01', '2025-04-30', 2),
        ];
        expect(validerPeriodisering(periodisering, false)).toBe(true);
        expect(validerPeriodisering(periodisering, true)).toBe(true);
    });

    test('hull er ugyldig uten hull-flagg', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
        ];
        expect(validerPeriodisering(periodisering, false)).toBe(false);
        expect(validerPeriodisering(periodisering, true)).toBe(true);
    });

    test('overlappende perioder er ugyldige uansett hull-flagg', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-03-15', '2025-04-15', 2),
        ];
        expect(validerPeriodisering(periodisering, false)).toBe(false);
        expect(validerPeriodisering(periodisering, true)).toBe(false);
    });

    test('identiske perioder er ugyldige', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-03-01', '2025-03-31', 2),
        ];
        expect(validerPeriodisering(periodisering, false)).toBe(false);
        expect(validerPeriodisering(periodisering, true)).toBe(false);
    });

    test('feil rekkefølge er ugyldig', () => {
        const periodisering = [
            element('2025-05-01', '2025-05-31', 1),
            element('2025-03-01', '2025-03-31', 2),
        ];
        expect(validerPeriodisering(periodisering, false)).toBe(false);
        expect(validerPeriodisering(periodisering, true)).toBe(false);
    });
});

describe('totalPeriode', () => {
    test('kaster feil på tom liste', () => {
        expect(() => totalPeriode([])).toThrow('Må ha minst en periode');
    });

    test('én periode gir samme periode', () => {
        const periode: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
        expect(totalPeriode([periode])).toEqual(periode);
    });

    test('gir ytterpunktene for usortert input', () => {
        expect(
            totalPeriode([
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ]),
        ).toEqual({ fraOgMed: '2025-03-01', tilOgMed: '2025-05-31' });
    });

    test('ytterpunktene kan komme fra ulike perioder', () => {
        expect(
            totalPeriode([
                { fraOgMed: '2025-01-01', tilOgMed: '2025-01-10' },
                { fraOgMed: '2025-06-01', tilOgMed: '2025-12-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ]),
        ).toEqual({ fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' });
    });

    test('inneholdt periode påvirker ikke totalen', () => {
        expect(
            totalPeriode([
                { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ]),
        ).toEqual({ fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' });
    });
});

describe('overlappendePeriode', () => {
    const a: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('ingen overlapp gir null', () => {
        expect(overlappendePeriode(a, { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' })).toBe(
            null,
        );
    });

    test('tilstøtende perioder overlapper ikke', () => {
        expect(overlappendePeriode(a, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' })).toBe(
            null,
        );
        expect(overlappendePeriode(a, { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' })).toBe(
            null,
        );
    });

    test('delvis overlapp gir snittet', () => {
        expect(overlappendePeriode(a, { fraOgMed: '2025-03-15', tilOgMed: '2025-04-15' })).toEqual({
            fraOgMed: '2025-03-15',
            tilOgMed: '2025-03-31',
        });
        expect(overlappendePeriode(a, { fraOgMed: '2025-02-15', tilOgMed: '2025-03-15' })).toEqual({
            fraOgMed: '2025-03-01',
            tilOgMed: '2025-03-15',
        });
    });

    test('inneholdt periode gir den minste perioden', () => {
        expect(overlappendePeriode(a, { fraOgMed: '2025-03-10', tilOgMed: '2025-03-20' })).toEqual({
            fraOgMed: '2025-03-10',
            tilOgMed: '2025-03-20',
        });
        expect(overlappendePeriode(a, { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' })).toEqual(
            a,
        );
    });

    test('identiske perioder gir samme periode', () => {
        expect(overlappendePeriode(a, { ...a })).toEqual(a);
    });

    test('én felles dag gir en én-dags periode', () => {
        expect(overlappendePeriode(a, { fraOgMed: '2025-03-31', tilOgMed: '2025-04-30' })).toEqual({
            fraOgMed: '2025-03-31',
            tilOgMed: '2025-03-31',
        });
    });
});

describe('erDatoIPeriode', () => {
    const periode: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('dato før perioden er utenfor', () => {
        expect(erDatoIPeriode('2025-02-28', periode)).toBe(false);
    });

    test('fraOgMed er inkludert', () => {
        expect(erDatoIPeriode('2025-03-01', periode)).toBe(true);
    });

    test('tilOgMed er inkludert', () => {
        expect(erDatoIPeriode('2025-03-31', periode)).toBe(true);
    });

    test('dato i midten er inkludert', () => {
        expect(erDatoIPeriode('2025-03-15', periode)).toBe(true);
    });

    test('dato etter perioden er utenfor', () => {
        expect(erDatoIPeriode('2025-04-01', periode)).toBe(false);
    });
});

describe('perioderOverlapper', () => {
    const a: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('disjunkte perioder overlapper ikke', () => {
        expect(perioderOverlapper(a, { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' })).toBe(
            false,
        );
        expect(perioderOverlapper(a, { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' })).toBe(
            false,
        );
    });

    test('tilstøtende perioder overlapper ikke', () => {
        expect(perioderOverlapper(a, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' })).toBe(
            false,
        );
        expect(perioderOverlapper(a, { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' })).toBe(
            false,
        );
    });

    test('delvis overlapp i begge retninger', () => {
        expect(perioderOverlapper(a, { fraOgMed: '2025-03-15', tilOgMed: '2025-04-15' })).toBe(
            true,
        );
        expect(perioderOverlapper(a, { fraOgMed: '2025-02-15', tilOgMed: '2025-03-15' })).toBe(
            true,
        );
    });

    test('inneholdelse regnes som overlapp', () => {
        expect(perioderOverlapper(a, { fraOgMed: '2025-03-10', tilOgMed: '2025-03-20' })).toBe(
            true,
        );
        expect(perioderOverlapper(a, { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' })).toBe(
            true,
        );
    });

    test('identiske perioder overlapper', () => {
        expect(perioderOverlapper(a, { ...a })).toBe(true);
    });

    test('én felles dag regnes som overlapp', () => {
        expect(perioderOverlapper(a, { fraOgMed: '2025-03-31', tilOgMed: '2025-04-30' })).toBe(
            true,
        );
    });
});

describe('inneholderHelePerioden', () => {
    const a: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('identiske perioder inneholder hverandre', () => {
        expect(inneholderHelePerioden(a, { ...a })).toBe(true);
    });

    test('inneholder periode i midten', () => {
        expect(inneholderHelePerioden(a, { fraOgMed: '2025-03-10', tilOgMed: '2025-03-20' })).toBe(
            true,
        );
    });

    test('inneholder ikke periode som starter før', () => {
        expect(inneholderHelePerioden(a, { fraOgMed: '2025-02-15', tilOgMed: '2025-03-15' })).toBe(
            false,
        );
    });

    test('inneholder ikke periode som slutter etter', () => {
        expect(inneholderHelePerioden(a, { fraOgMed: '2025-03-15', tilOgMed: '2025-04-15' })).toBe(
            false,
        );
    });

    test('inneholder ikke større periode', () => {
        expect(inneholderHelePerioden(a, { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' })).toBe(
            false,
        );
    });

    test('inneholder ikke disjunkt periode', () => {
        expect(inneholderHelePerioden(a, { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' })).toBe(
            false,
        );
    });
});

describe('erFullstendigPeriode', () => {
    test('begge datoer satt er fullstendig', () => {
        expect(erFullstendigPeriode({ fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' })).toBe(true);
    });

    test('mangler fraOgMed', () => {
        expect(erFullstendigPeriode({ tilOgMed: '2025-03-31' })).toBe(false);
    });

    test('mangler tilOgMed', () => {
        expect(erFullstendigPeriode({ fraOgMed: '2025-03-01' })).toBe(false);
    });

    test('tomt objekt er ikke fullstendig', () => {
        expect(erFullstendigPeriode({})).toBe(false);
    });
});

describe('perioderErLike', () => {
    const a: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('identiske perioder er like', () => {
        expect(perioderErLike(a, { ...a })).toBe(true);
    });

    test('ulik fraOgMed', () => {
        expect(perioderErLike(a, { fraOgMed: '2025-03-02', tilOgMed: '2025-03-31' })).toBe(false);
    });

    test('ulik tilOgMed', () => {
        expect(perioderErLike(a, { fraOgMed: '2025-03-01', tilOgMed: '2025-03-30' })).toBe(false);
    });
});

describe('perioderErSammenhengende', () => {
    test('kaster feil uten perioder', () => {
        expect(() => perioderErSammenhengende()).toThrow('Må ha minst en periode');
    });

    test('én periode er sammenhengende', () => {
        expect(perioderErSammenhengende({ fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' })).toBe(
            true,
        );
    });

    test('to tilstøtende perioder er sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
            ),
        ).toBe(true);
    });

    test('hull mellom perioder er ikke sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-02', tilOgMed: '2025-04-30' },
            ),
        ).toBe(false);
    });

    test('overlappende perioder er ikke sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-03-31', tilOgMed: '2025-04-30' },
            ),
        ).toBe(false);
    });

    test('feil rekkefølge er ikke sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ),
        ).toBe(false);
    });

    test('tre perioder i kjede er sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
            ),
        ).toBe(true);
    });

    test('hull i slutten av kjeden er ikke sammenhengende', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                { fraOgMed: '2025-05-02', tilOgMed: '2025-05-31' },
            ),
        ).toBe(false);
    });

    test('sammenheng over månedsskifte', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-01-15', tilOgMed: '2025-01-31' },
                { fraOgMed: '2025-02-01', tilOgMed: '2025-02-14' },
            ),
        ).toBe(true);
    });

    test('sammenheng over årsskifte', () => {
        expect(
            perioderErSammenhengende(
                { fraOgMed: '2025-12-15', tilOgMed: '2025-12-31' },
                { fraOgMed: '2026-01-01', tilOgMed: '2026-01-14' },
            ),
        ).toBe(true);
    });
});

describe('periodiseringerErLike', () => {
    const sammenlignAntall = (a: { antall: number }, b: { antall: number }) =>
        a.antall === b.antall;

    test('to tomme periodiseringer er like', () => {
        expect(periodiseringerErLike([], [], sammenlignAntall)).toBe(true);
    });

    test('ulik lengde er ikke like', () => {
        expect(
            periodiseringerErLike([element('2025-03-01', '2025-03-31', 1)], [], sammenlignAntall),
        ).toBe(false);
    });

    test('like perioder og verdier er like', () => {
        expect(
            periodiseringerErLike(
                [element('2025-03-01', '2025-03-31', 1)],
                [element('2025-03-01', '2025-03-31', 1)],
                sammenlignAntall,
            ),
        ).toBe(true);
    });

    test('like perioder med ulike verdier er ikke like', () => {
        expect(
            periodiseringerErLike(
                [element('2025-03-01', '2025-03-31', 1)],
                [element('2025-03-01', '2025-03-31', 2)],
                sammenlignAntall,
            ),
        ).toBe(false);
    });

    test('ulike perioder med like verdier er ikke like', () => {
        expect(
            periodiseringerErLike(
                [element('2025-03-01', '2025-03-31', 1)],
                [element('2025-04-01', '2025-04-30', 1)],
                sammenlignAntall,
            ),
        ).toBe(false);
    });

    test('rekkefølge har betydning', () => {
        expect(
            periodiseringerErLike(
                [element('2025-03-01', '2025-03-31', 1), element('2025-05-01', '2025-05-31', 2)],
                [element('2025-05-01', '2025-05-31', 2), element('2025-03-01', '2025-03-31', 1)],
                sammenlignAntall,
            ),
        ).toBe(false);
    });
});

describe('periodiseringTotalPeriode', () => {
    test('kaster feil på tom periodisering', () => {
        expect(() => periodiseringTotalPeriode([])).toThrow('Må ha minst en periode');
    });

    test('gir ytterpunktene inkludert eventuelle hull', () => {
        expect(
            periodiseringTotalPeriode([
                element('2025-03-01', '2025-03-31', 1),
                element('2025-05-01', '2025-05-31', 2),
            ]),
        ).toEqual({ fraOgMed: '2025-03-01', tilOgMed: '2025-05-31' });
    });
});

describe('krympPeriodisering', () => {
    const periodisering = [
        element('2025-03-01', '2025-03-31', 1),
        element('2025-05-01', '2025-05-31', 2),
        element('2025-07-01', '2025-07-31', 3),
    ];

    test('ingen overlapp gir tom liste', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-09-01', tilOgMed: '2025-09-30' }),
        ).toEqual([]);
    });

    test('krymp som dekker alt endrer ingenting', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' }),
        ).toEqual(periodisering);
    });

    test('krymp inni ett element gir snittet', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-03-10', tilOgMed: '2025-03-20' }),
        ).toEqual([element('2025-03-10', '2025-03-20', 1)]);
    });

    test('krymp over flere elementer kutter ytterkantene og fyller ikke hull', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-03-15', tilOgMed: '2025-07-15' }),
        ).toEqual([
            element('2025-03-15', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 2),
            element('2025-07-01', '2025-07-15', 3),
        ]);
    });

    test('tilstøtende krymp uten felles dager gir tom liste', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }),
        ).toEqual([]);
    });

    test('krymp som deler én dag med et element gir en én-dags periode', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-03-31', tilOgMed: '2025-04-15' }),
        ).toEqual([element('2025-03-31', '2025-03-31', 1)]);
    });

    test('krymp som bare treffer midterste element gir bare det elementet', () => {
        expect(
            krympPeriodisering(periodisering, { fraOgMed: '2025-05-10', tilOgMed: '2025-05-20' }),
        ).toEqual([element('2025-05-10', '2025-05-20', 2)]);
    });
});

describe('finnPerioderHull', () => {
    test('tom liste gir ingen hull', () => {
        expect(finnPerioderHull([])).toEqual([]);
    });

    test('én periode gir ingen hull', () => {
        expect(finnPerioderHull([{ fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' }])).toEqual([]);
    });

    test('sammenhengende perioder gir ingen hull', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
            ]),
        ).toEqual([]);
    });

    test('finner ett hull mellom to perioder', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
            ]),
        ).toEqual([{ fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }]);
    });

    test('finner flere hull', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
            ]),
        ).toEqual([
            { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' },
            { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
        ]);
    });

    test('hull på én dag', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-02', tilOgMed: '2025-04-30' },
            ]),
        ).toEqual([{ fraOgMed: '2025-04-01', tilOgMed: '2025-04-01' }]);
    });

    test('overlappende perioder gir ingen hull', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-03-15', tilOgMed: '2025-04-15' },
            ]),
        ).toEqual([]);
    });

    test('periode fullt inneholdt i en annen gir ingen hull', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-03-10', tilOgMed: '2025-03-20' },
            ]),
        ).toEqual([]);
    });

    test('usortert input gir likevel hull', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ]),
        ).toEqual([{ fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }]);
    });

    test('hull over årsskifte', () => {
        expect(
            finnPerioderHull([
                { fraOgMed: '2025-11-01', tilOgMed: '2025-11-30' },
                { fraOgMed: '2026-02-01', tilOgMed: '2026-02-28' },
            ]),
        ).toEqual([{ fraOgMed: '2025-12-01', tilOgMed: '2026-01-31' }]);
    });
});

describe('finnPeriodiseringHull', () => {
    test('finner hull i periodisering', () => {
        expect(
            finnPeriodiseringHull([
                element('2025-03-01', '2025-03-31', 1),
                element('2025-05-01', '2025-05-31', 2),
            ]),
        ).toEqual([{ fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }]);
    });

    test('tom periodisering gir ingen hull', () => {
        expect(finnPeriodiseringHull([])).toEqual([]);
    });
});

describe('slåSammenPeriodisering', () => {
    const sammenlignAntall = (a: { antall: number }, b: { antall: number }) =>
        a.antall === b.antall;

    test('tom periodisering gir tom liste', () => {
        expect(slåSammenPeriodisering([], sammenlignAntall)).toEqual([]);
    });

    test('ett element forblir uendret', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];
        expect(slåSammenPeriodisering(periodisering, sammenlignAntall)).toEqual(periodisering);
    });

    test('tilstøtende elementer med lik verdi slås sammen', () => {
        expect(
            slåSammenPeriodisering(
                [element('2025-03-01', '2025-03-31', 1), element('2025-04-01', '2025-04-30', 1)],
                sammenlignAntall,
            ),
        ).toEqual([element('2025-03-01', '2025-04-30', 1)]);
    });

    test('tilstøtende elementer med ulik verdi slås ikke sammen', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-04-01', '2025-04-30', 2),
        ];
        expect(slåSammenPeriodisering(periodisering, sammenlignAntall)).toEqual(periodisering);
    });

    test('elementer med hull slås ikke sammen selv med lik verdi', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-05-01', '2025-05-31', 1),
        ];
        expect(slåSammenPeriodisering(periodisering, sammenlignAntall)).toEqual(periodisering);
    });

    test('overlappende elementer med lik verdi slås ikke sammen', () => {
        const periodisering = [
            element('2025-03-01', '2025-03-31', 1),
            element('2025-03-15', '2025-04-15', 1),
        ];
        expect(slåSammenPeriodisering(periodisering, sammenlignAntall)).toEqual(periodisering);
    });

    test('kjede av tre tilstøtende elementer med lik verdi slås sammen til ett', () => {
        expect(
            slåSammenPeriodisering(
                [
                    element('2025-03-01', '2025-03-31', 1),
                    element('2025-04-01', '2025-04-30', 1),
                    element('2025-05-01', '2025-05-31', 1),
                ],
                sammenlignAntall,
            ),
        ).toEqual([element('2025-03-01', '2025-05-31', 1)]);
    });

    test('sammenslått element arver øvrige felter fra det siste elementet', () => {
        type MedNavn = MedPeriode<{ antall: number; navn: string }>;
        const a: MedNavn = {
            antall: 1,
            navn: 'første',
            periode: { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
        };
        const b: MedNavn = {
            antall: 1,
            navn: 'siste',
            periode: { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
        };

        expect(slåSammenPeriodisering([a, b], (x, y) => x.antall === y.antall)).toEqual([
            { ...b, periode: { fraOgMed: '2025-03-01', tilOgMed: '2025-04-30' } },
        ]);
    });
});

describe('slåSammenPerioder', () => {
    test('tom liste gir tom liste', () => {
        expect(slåSammenPerioder([])).toEqual([]);
    });

    test('én periode forblir uendret', () => {
        const periode: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
        expect(slåSammenPerioder([periode])).toEqual([periode]);
    });

    test('tilstøtende perioder slås sammen', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
            ]),
        ).toEqual([{ fraOgMed: '2025-03-01', tilOgMed: '2025-04-30' }]);
    });

    test('overlappende perioder slås sammen med seneste tilOgMed', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-03-15', tilOgMed: '2025-04-15' },
            ]),
        ).toEqual([{ fraOgMed: '2025-03-01', tilOgMed: '2025-04-15' }]);
    });

    test('inneholdt periode slås sammen uten å krympe', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            ]),
        ).toEqual([{ fraOgMed: '2025-01-01', tilOgMed: '2025-12-31' }]);
    });

    test('disjunkte perioder slås ikke sammen', () => {
        const perioder: Periode[] = [
            { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
            { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
        ];
        expect(slåSammenPerioder(perioder)).toEqual(perioder);
    });

    test('usortert input sorteres og slås sammen', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
            ]),
        ).toEqual([{ fraOgMed: '2025-03-01', tilOgMed: '2025-05-31' }]);
    });

    test('kjede av overlappende og tilstøtende perioder slås sammen til én', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-01-01', tilOgMed: '2025-01-10' },
                { fraOgMed: '2025-01-05', tilOgMed: '2025-01-15' },
                { fraOgMed: '2025-01-16', tilOgMed: '2025-01-20' },
            ]),
        ).toEqual([{ fraOgMed: '2025-01-01', tilOgMed: '2025-01-20' }]);
    });

    test('flere adskilte grupper beholdes hver for seg', () => {
        expect(
            slåSammenPerioder([
                { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
                { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' },
                { fraOgMed: '2025-07-01', tilOgMed: '2025-07-31' },
                { fraOgMed: '2025-08-01', tilOgMed: '2025-08-31' },
            ]),
        ).toEqual([
            { fraOgMed: '2025-03-01', tilOgMed: '2025-04-30' },
            { fraOgMed: '2025-07-01', tilOgMed: '2025-08-31' },
        ]);
    });

    test('input-array endres ikke', () => {
        const perioder: Periode[] = [
            { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' },
            { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' },
        ];
        const uendret = structuredClone(perioder);

        slåSammenPerioder(perioder);

        expect(perioder).toEqual(uendret);
    });
});

describe('sorterPerioder', () => {
    const p1: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
    const p2: Periode = { fraOgMed: '2025-05-01', tilOgMed: '2025-05-31' };

    test('sorterer stigende som standard', () => {
        expect([p2, p1].toSorted(sorterPerioder())).toEqual([p1, p2]);
    });

    test('sorterer synkende', () => {
        expect([p1, p2].toSorted(sorterPerioder('desc'))).toEqual([p2, p1]);
    });

    test('samme fraOgMed sorteres på tilOgMed', () => {
        const kort: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-15' };
        expect([p1, kort].toSorted(sorterPerioder())).toEqual([kort, p1]);
        expect([kort, p1].toSorted(sorterPerioder('desc'))).toEqual([p1, kort]);
    });

    test('identiske perioder er like', () => {
        expect(sorterPerioder()(p1, { ...p1 })).toBe(0);
    });
});

describe('sorterPeriodisering', () => {
    const e1 = element('2025-03-01', '2025-03-31', 1);
    const e2 = element('2025-05-01', '2025-05-31', 2);

    test('sorterer stigende som standard', () => {
        expect([e2, e1].toSorted(sorterPeriodisering())).toEqual([e1, e2]);
    });

    test('sorterer synkende', () => {
        expect([e1, e2].toSorted(sorterPeriodisering('desc'))).toEqual([e2, e1]);
    });

    test('samme fraOgMed sorteres på tilOgMed', () => {
        const kort = element('2025-03-01', '2025-03-15', 3);
        expect([e1, kort].toSorted(sorterPeriodisering())).toEqual([kort, e1]);
    });

    test('identiske perioder er like', () => {
        expect(sorterPeriodisering()(e1, { ...e1 })).toBe(0);
    });
});

describe('oppdaterPeriode', () => {
    const periode: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };

    test('tom oppdatering endrer ingenting', () => {
        expect(oppdaterPeriode(periode, {})).toEqual(periode);
    });

    test('begge felter settes direkte', () => {
        expect(
            oppdaterPeriode(periode, { fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' }),
        ).toEqual({ fraOgMed: '2025-04-01', tilOgMed: '2025-04-30' });
    });

    test('ny fraOgMed innenfor perioden beholder tilOgMed', () => {
        expect(oppdaterPeriode(periode, { fraOgMed: '2025-03-10' })).toEqual({
            fraOgMed: '2025-03-10',
            tilOgMed: '2025-03-31',
        });
    });

    test('ny fraOgMed etter tilOgMed utvider tilOgMed til å matche', () => {
        expect(oppdaterPeriode(periode, { fraOgMed: '2025-04-15' })).toEqual({
            fraOgMed: '2025-04-15',
            tilOgMed: '2025-04-15',
        });
    });

    test('ny tilOgMed innenfor perioden beholder fraOgMed', () => {
        expect(oppdaterPeriode(periode, { tilOgMed: '2025-03-20' })).toEqual({
            fraOgMed: '2025-03-01',
            tilOgMed: '2025-03-20',
        });
    });

    test('ny tilOgMed før fraOgMed flytter fraOgMed til å matche', () => {
        expect(oppdaterPeriode(periode, { tilOgMed: '2025-02-15' })).toEqual({
            fraOgMed: '2025-02-15',
            tilOgMed: '2025-02-15',
        });
    });
});

describe('oppdaterPartialPeriode', () => {
    test('tom oppdatering endrer ingenting', () => {
        const periode: Partial<Periode> = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
        expect(oppdaterPartialPeriode(periode, {})).toEqual(periode);
    });

    test('oppdaterer fullstendig periode som oppdaterPeriode', () => {
        const periode: Partial<Periode> = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
        expect(oppdaterPartialPeriode(periode, { fraOgMed: '2025-04-15' })).toEqual({
            fraOgMed: '2025-04-15',
            tilOgMed: '2025-04-15',
        });
    });

    test('setter tilOgMed på periode som mangler den', () => {
        expect(
            oppdaterPartialPeriode({ fraOgMed: '2025-03-01' }, { tilOgMed: '2025-03-31' }),
        ).toEqual({
            fraOgMed: '2025-03-01',
            tilOgMed: '2025-03-31',
        });
    });

    test('setter fraOgMed på periode som mangler den', () => {
        expect(
            oppdaterPartialPeriode({ tilOgMed: '2025-03-31' }, { fraOgMed: '2025-03-01' }),
        ).toEqual({
            fraOgMed: '2025-03-01',
            tilOgMed: '2025-03-31',
        });
    });

    test('tilOgMed-oppdatering alene oppretter ikke fraOgMed', () => {
        expect(oppdaterPartialPeriode({}, { tilOgMed: '2025-03-31' })).toEqual({
            fraOgMed: undefined,
            tilOgMed: '2025-03-31',
        });
    });

    test('fraOgMed-oppdatering alene oppretter ikke tilOgMed', () => {
        expect(oppdaterPartialPeriode({}, { fraOgMed: '2025-03-01' })).toEqual({
            fraOgMed: '2025-03-01',
            tilOgMed: undefined,
        });
    });

    test('helt tom periode og oppdatering forblir tom', () => {
        expect(oppdaterPartialPeriode({}, {})).toEqual({
            fraOgMed: undefined,
            tilOgMed: undefined,
        });
    });

    test('perioden slutter dagen før første element og regnes som før periodiseringen', () => {
        const periodisering = [element('2025-03-01', '2025-03-31', 1)];

        expect(
            utvidPeriodisering(
                periodisering,
                { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' },
                true,
            ),
        ).toEqual([{ antall: 1, periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' } }]);
    });
});
