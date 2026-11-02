import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
    alderFraDato,
    antallKalenderDagerUnnaDagensDato,
    datoMax,
    datoMin,
    dateTilISOTekst,
    erHelg,
    finn16årsdag,
    finn18årsdag,
    formaterDatotekst,
    formaterMeldeperiode,
    formaterMeldeperiodeKort,
    formaterPeriodeKort,
    formaterSladdbarDatotekst,
    formaterTidspunkt,
    forrigeDag,
    leggTilDager,
    nesteDag,
    tilDate,
    ukedagFraDato,
    ukedagFraDatoKort,
    ukenummerFraDatotekst,
    ukenummerFraPeriode,
} from '~/utils/date';
import { SLADDET_TEKST_DEFAULT } from '~/utils/sladdetVerdi';
import { nonNullish } from '~/utils/object';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';

describe('formaterDatotekst', () => {
    test('formaterer en gyldig ISO-dato som DD.MM.YYYY', () => {
        expect(formaterDatotekst('2025-03-09')).toBe('09.03.2025');
    });

    test('gir ukjent for tom verdi', () => {
        expect(formaterDatotekst('')).toBe('ukjent');
    });
});

describe('formaterSladdbarDatotekst', () => {
    test('formaterer en verdi som ikke er sladdet', () => {
        expect(formaterSladdbarDatotekst(ikkeSladdet('2025-03-09'))).toBe('09.03.2025');
    });

    test('viser sladdet tekst for en sladdet verdi', () => {
        expect(formaterSladdbarDatotekst(sladdet)).toBe(SLADDET_TEKST_DEFAULT);
    });
});

describe('formaterTidspunkt', () => {
    test('viser dato og klokkeslett med to sifre', () => {
        expect(formaterTidspunkt('2025-03-09T08:05:30')).toBe('09.03.2025 kl. 08:05');
    });
});

describe('formaterPeriodeKort', () => {
    test('utelater årstallet på fra og med-datoen når perioden er innenfor ett år', () => {
        expect(formaterPeriodeKort({ fraOgMed: '2025-01-06', tilOgMed: '2025-01-19' })).toBe(
            '06.01 - 19.01.2025',
        );
    });

    test('viser begge årstall når perioden går over et årsskifte', () => {
        expect(formaterPeriodeKort({ fraOgMed: '2025-12-29', tilOgMed: '2026-01-11' })).toBe(
            '29.12.2025 - 11.01.2026',
        );
    });
});

describe('ukedager og ukenummer', () => {
    test('uken starter på mandag', () => {
        expect(ukedagFraDato('2025-01-06')).toBe('Mandag');
        expect(ukedagFraDatoKort('2025-01-12')).toBe('Søn');
    });

    test('bare lørdag og søndag er helg', () => {
        expect(erHelg('2025-01-10')).toBe(false); // fredag
        expect(erHelg('2025-01-11')).toBe(true); // lørdag
        expect(erHelg('2025-01-12')).toBe(true); // søndag
        expect(erHelg('2025-01-13')).toBe(false); // mandag
    });

    test('ukenummer følger ISO-uker, også rundt årsskiftet', () => {
        expect(ukenummerFraDatotekst('2025-01-01')).toBe(1);
        expect(ukenummerFraDatotekst('2025-12-29')).toBe(1);
        expect(ukenummerFraDatotekst('2027-01-01')).toBe(53);
    });

    test('meldeperioden vises med ukenumrene for begge ukene', () => {
        const meldeperiode = { fraOgMed: '2025-12-22', tilOgMed: '2026-01-04' };

        expect(ukenummerFraPeriode(meldeperiode)).toBe('52 - 1');
        expect(formaterMeldeperiode(meldeperiode)).toBe('22.12.2025 - 04.01.2026 (uke 52 og 1)');
        expect(formaterMeldeperiodeKort({ fraOgMed: '2025-01-06', tilOgMed: '2025-01-19' })).toBe(
            '06.01 - 19.01.2025 (uke 2 og 3)',
        );
    });
});

describe('dagsaritmetikk', () => {
    test('legger til og trekker fra dager over måneds- og årsskifter', () => {
        expect(leggTilDager('2025-01-31', 1)).toBe('2025-02-01');
        expect(leggTilDager('2025-01-06', 13)).toBe('2025-01-19');
        expect(nesteDag('2024-02-28')).toBe('2024-02-29');
        expect(nesteDag('2025-12-31')).toBe('2026-01-01');
        expect(forrigeDag('2025-03-01')).toBe('2025-02-28');
    });

    test('16- og 18-årsdagen regnes fra fødselsdatoen', () => {
        expect(finn16årsdag('2010-05-17')).toBe('2026-05-17');
        expect(finn18årsdag('2008-05-17')).toBe('2026-05-17');
    });

    test('født 29. februar fyller år 28. februar i år som ikke er skuddår, som LocalDate.plusYears i backend', () => {
        expect(finn16årsdag('2008-02-29')).toBe('2024-02-29');
        expect(finn18årsdag('2008-02-29')).toBe('2026-02-28');
    });

    test('minste og største dato, uavhengig av rekkefølge og type', () => {
        expect(datoMin('2025-03-01', new Date(2025, 0, 15), '2025-02-01')).toBe('2025-01-15');
        expect(datoMax('2025-03-01', new Date(2025, 0, 15), '2025-02-01')).toBe('2025-03-01');
    });

    test('minste og største dato kaster uten datoer', () => {
        expect(() => datoMin()).toThrow();
        expect(() => datoMax()).toThrow();
    });
});

describe('konvertering', () => {
    test('dateTilISOTekst bruker lokal dato, ikke UTC', () => {
        expect(dateTilISOTekst(new Date(2025, 0, 1, 0, 30))).toBe('2025-01-01');
        expect(dateTilISOTekst(new Date(2025, 0, 1, 23, 30))).toBe('2025-01-01');
    });

    test('tilDate gir undefined for manglende verdi og beholder Date-objekter', () => {
        const dato = new Date(2025, 0, 1);

        expect(tilDate(undefined)).toBeUndefined();
        expect(tilDate('')).toBeUndefined();
        expect(tilDate(dato)).toBe(dato);
        expect(dateTilISOTekst(nonNullish(tilDate('2025-01-01')))).toBe('2025-01-01');
    });
});

describe('beregninger mot dagens dato', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    test('alderen øker først på bursdagen', () => {
        jest.useFakeTimers().setSystemTime(new Date(2025, 4, 16, 12));
        expect(alderFraDato('2008-05-17')).toBe(16);

        jest.setSystemTime(new Date(2025, 4, 17, 0, 1));
        expect(alderFraDato('2008-05-17')).toBe(17);
    });

    test('antall kalenderdager ignorerer klokkeslettet', () => {
        jest.useFakeTimers().setSystemTime(new Date(2025, 0, 10, 23, 59));

        expect(antallKalenderDagerUnnaDagensDato('2025-01-10')).toBe(0);
        expect(antallKalenderDagerUnnaDagensDato('2025-01-11T00:01:00')).toBe(1);
        expect(antallKalenderDagerUnnaDagensDato('2025-01-03')).toBe(-7);
    });
});
