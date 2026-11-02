import { describe, expect, test } from '@jest/globals';
import {
    erTidslinjeElementInnvilgelse,
    tellAntallBarnFraVedtak,
    tellAntallDagerFraVedtak,
} from '~/lib/_felles/tidslinjer/tidslinjerUtils';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    periode,
    rammevedtak,
} from '~test/rammebehandling';

const vedtaksperiode = periode('2025-01-01', '2025-06-30');

describe('erTidslinjeElementInnvilgelse', () => {
    test('innvilgelser fra søknadsbehandling, revurdering og omgjøring regnes som innvilgelse', () => {
        expect(erTidslinjeElementInnvilgelse(TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE)).toBe(
            true,
        );
        expect(erTidslinjeElementInnvilgelse(TidslinjeResultat.REVURDERING_INNVILGELSE)).toBe(true);
        expect(erTidslinjeElementInnvilgelse(TidslinjeResultat.OMGJØRING_INNVILGELSE)).toBe(true);
    });

    test('stans og opphør regnes ikke som innvilgelse', () => {
        expect(erTidslinjeElementInnvilgelse(TidslinjeResultat.STANS)).toBe(false);
        expect(erTidslinjeElementInnvilgelse(TidslinjeResultat.OMGJØRING_OPPHØR)).toBe(false);
    });
});

describe('tellAntallBarnFraVedtak', () => {
    test('gir spennet i antall barn over de gjeldende barnetilleggsperiodene', () => {
        const vedtak = rammevedtak('vedtak_1', vedtaksperiode, {
            gjeldendeBarnetilleggPerioder: [
                barnetilleggPeriode(2, periode('2025-01-01', '2025-02-28')),
                barnetilleggPeriode(1, periode('2025-03-01', '2025-04-30')),
                barnetilleggPeriode(3, periode('2025-05-01', '2025-06-30')),
            ],
        });

        expect(tellAntallBarnFraVedtak(vedtak)).toEqual({ min: 1, max: 3 });
    });

    test('uten barnetillegg er antallet 0', () => {
        const vedtak = rammevedtak('vedtak_1', vedtaksperiode, {
            gjeldendeBarnetilleggPerioder: [],
        });

        expect(tellAntallBarnFraVedtak(vedtak)).toEqual({ min: 0, max: 0 });
    });
});

describe('tellAntallDagerFraVedtak', () => {
    test('gir spennet i antall dager per meldeperiode over innvilgelsesperiodene', () => {
        const vedtak = rammevedtak('vedtak_1', vedtaksperiode, {
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                    antallDagerPerMeldeperiode: 6,
                }),
                innvilgelsesperiode(periode('2025-04-01', '2025-06-30'), {
                    antallDagerPerMeldeperiode: 10,
                }),
            ],
        });

        expect(tellAntallDagerFraVedtak(vedtak)).toEqual({ min: 6, max: 10 });
    });

    test('vedtak uten innvilgelsesperioder (f.eks. stans) gir 0', () => {
        expect(
            tellAntallDagerFraVedtak(
                rammevedtak('vedtak_1', vedtaksperiode, { innvilgelsesperioder: null }),
            ),
        ).toEqual({ min: 0, max: 0 });
        expect(
            tellAntallDagerFraVedtak(
                rammevedtak('vedtak_1', vedtaksperiode, { innvilgelsesperioder: [] }),
            ),
        ).toEqual({ min: 0, max: 0 });
    });
});
