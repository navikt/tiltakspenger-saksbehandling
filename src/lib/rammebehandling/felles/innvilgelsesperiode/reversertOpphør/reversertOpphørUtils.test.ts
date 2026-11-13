import { describe, expect, test } from '@jest/globals';
import { omgjøringInnvilgelse, periode, søknadsbehandlingInnvilgelse } from '~test/rammebehandling';
import {
    erInnenforPeriodeForReversertOpphør,
    hentPerioderForReversertOpphør,
    hentPerioderForReversertOpphørIVedtaksperioden,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';
import {
    harInnvilgbarePerioder,
    hentTotalInnvilgbarPeriode,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import { tilDato } from '~/types/DatoTid';

const mars = periode('2025-03-01', '2025-03-31');

const omgjøringMedReversertOpphørIMars = omgjøringInnvilgelse({
    innvilgbarePerioder: [],
    perioderForReversertOpphør: [
        { internDeltakelseId: 'deltakelse_1', periode: mars, typeNavn: 'AMO' },
    ],
});

describe('reversert opphør', () => {
    test('søknadsbehandlinger har aldri perioder for reversert opphør', () => {
        expect(hentPerioderForReversertOpphør(søknadsbehandlingInnvilgelse())).toEqual([]);
    });

    test('perioden må være innenfor en periode for reversert opphør for samme tiltaksdeltakelse', () => {
        expect(
            erInnenforPeriodeForReversertOpphør(
                omgjøringMedReversertOpphørIMars,
                'deltakelse_1',
                periode('2025-03-10', '2025-03-20'),
            ),
        ).toBe(true);
        expect(
            erInnenforPeriodeForReversertOpphør(
                omgjøringMedReversertOpphørIMars,
                'deltakelse_1',
                periode('2025-02-20', '2025-03-20'),
            ),
        ).toBe(false);
        expect(
            erInnenforPeriodeForReversertOpphør(
                omgjøringMedReversertOpphørIMars,
                'deltakelse_2',
                periode('2025-03-10', '2025-03-20'),
            ),
        ).toBe(false);
    });

    test('bare perioder for reversert opphør som overlapper vedtaksperioden kan velges', () => {
        const behandling = omgjøringMedReversertOpphørIMars;

        expect(
            hentPerioderForReversertOpphørIVedtaksperioden(
                behandling,
                periode('2025-03-15', '2025-04-30'),
            ),
        ).toEqual(behandling.perioderForReversertOpphør);
        expect(
            hentPerioderForReversertOpphørIVedtaksperioden(
                behandling,
                periode('2025-01-01', '2025-02-28'),
            ),
        ).toEqual([]);
        expect(
            hentPerioderForReversertOpphørIVedtaksperioden(behandling, {
                fraOgMed: tilDato('2025-01-01'),
            }),
        ).toEqual([]);
    });

    test('perioder for reversert opphør kan innvilges selv uten gyldige tiltaksdeltakelser', () => {
        expect(harInnvilgbarePerioder(omgjøringMedReversertOpphørIMars)).toBe(true);
        expect(hentTotalInnvilgbarPeriode(omgjøringMedReversertOpphørIMars)).toEqual(mars);
    });
});
