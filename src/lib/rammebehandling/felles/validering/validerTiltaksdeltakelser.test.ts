import { describe, expect, test } from '@jest/globals';
import { validerTiltaksdeltakelser } from '~/lib/rammebehandling/felles/validering/validerTiltaksdeltakelser';
import {
    innvilgelsesperiode,
    periode,
    søknadsbehandlingInnvilgelse,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import { Tiltaksdeltakelse } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';

const tiltakA = tiltaksdeltakelse('tiltak_a', periode('2025-01-01', '2025-03-31'));
const tiltakB = tiltaksdeltakelse('tiltak_b', periode('2025-04-01', '2025-06-30'));

const ikkeInnvilgbartTiltak: Tiltaksdeltakelse = {
    ...tiltaksdeltakelse('tiltak_ikke_innvilgbar', periode('2025-01-01', '2025-06-30')),
    kanInnvilges: false,
};

const behandlingMedTiltak = (...tiltaksdeltagelse: Tiltaksdeltakelse[]) => {
    const behandling = søknadsbehandlingInnvilgelse();
    return {
        ...behandling,
        saksopplysninger: { ...behandling.saksopplysninger, tiltaksdeltagelse },
    };
};

describe('validerTiltaksdeltakelser', () => {
    test('validerer valgt tiltaksdeltakelse også når det bare finnes ett tiltak som kan innvilges', () => {
        const behandling = behandlingMedTiltak(tiltakA, ikkeInnvilgbartTiltak);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2025-01-01', '2025-04-30'), {
                internDeltakelseId: 'tiltak_a',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
        ]);
    });

    test('godtar innvilgelsesperioder som er nøyaktig innenfor hver sin valgte tiltaksdeltakelse', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(tiltakA.periode, { internDeltakelseId: 'tiltak_a' }),
            innvilgelsesperiode(tiltakB.periode, { internDeltakelseId: 'tiltak_b' }),
        ]);

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('avviser en innvilgelsesperiode som går utenfor sin egen tiltaksdeltakelse, selv om den er innenfor et annet tiltak', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2025-03-01', '2025-04-30'), {
                internDeltakelseId: 'tiltak_a',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
        ]);
    });

    test('avviser en innvilgelsesperiode som starter før tiltaksdeltakelsens startdato', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2025-03-31', '2025-06-30'), {
                internDeltakelseId: 'tiltak_b',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
        ]);
    });

    test('gir begge feilene når innvilgelsesperioden starter før og slutter etter tiltaksdeltakelsen', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2025-03-31', '2025-07-01'), {
                internDeltakelseId: 'tiltak_b',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
            'Valgt innvilgelsesperiode kan ikke slutte etter tiltaksdeltakelsens sluttdato',
        ]);
    });

    test('avviser en tiltaksdeltakelse som ikke finnes i saksopplysningene', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(tiltakA.periode, { internDeltakelseId: 'finnes_ikke' }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt tiltaksdeltakelse finnes ikke lenger i saksopplysningene',
        ]);
    });

    test('avviser en tiltaksdeltakelse det ikke kan innvilges for, uten å sjekke periodene', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB, ikkeInnvilgbartTiltak);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2024-01-01', '2026-01-01'), {
                internDeltakelseId: 'tiltak_ikke_innvilgbar',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Kan ikke velge tiltaksdeltakelse som det ikke kan innvilges for',
        ]);
    });

    test('gir én feil per ugyldig innvilgelsesperiode', () => {
        const behandling = behandlingMedTiltak(tiltakA, tiltakB);

        const resultat = validerTiltaksdeltakelser(behandling, [
            innvilgelsesperiode(periode('2025-01-01', '2025-01-31'), {
                internDeltakelseId: 'tiltak_a',
            }),
            innvilgelsesperiode(periode('2025-02-01', '2025-02-28'), {
                internDeltakelseId: 'tiltak_b',
            }),
            innvilgelsesperiode(periode('2025-04-01', '2025-04-30'), {
                internDeltakelseId: 'finnes_ikke',
            }),
        ]);

        expect(resultat.errors).toEqual([
            'Valgt innvilgelsesperiode kan ikke starte før tiltaksdeltakelsens startdato',
            'Valgt tiltaksdeltakelse finnes ikke lenger i saksopplysningene',
        ]);
    });
});
