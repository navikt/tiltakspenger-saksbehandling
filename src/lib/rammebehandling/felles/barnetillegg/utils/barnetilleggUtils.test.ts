import { describe, expect, test } from '@jest/globals';
import { barnetilleggForInnvilgelsesperiodene } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { barnetilleggPeriode, periode } from '~test/rammebehandling';

describe('barnetilleggForInnvilgelsesperiodene', () => {
    test('gir 0 barn i innvilgelsesperiodene uten barnetillegg, og ingenting utenfor', () => {
        expect(
            barnetilleggForInnvilgelsesperiodene(
                [
                    barnetilleggPeriode(1, periode('2025-01-15', '2025-01-31')),
                    barnetilleggPeriode(2, periode('2025-03-01', '2025-03-31')),
                ],
                [periode('2025-01-01', '2025-01-31'), periode('2025-03-01', '2025-04-30')],
            ),
        ).toEqual([
            barnetilleggPeriode(0, periode('2025-01-01', '2025-01-14')),
            barnetilleggPeriode(1, periode('2025-01-15', '2025-01-31')),
            barnetilleggPeriode(2, periode('2025-03-01', '2025-03-31')),
            barnetilleggPeriode(0, periode('2025-04-01', '2025-04-30')),
        ]);
    });
});
