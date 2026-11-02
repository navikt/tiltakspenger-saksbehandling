import { describe, expect, test } from '@jest/globals';
import { revurderingStansValidering } from '~/lib/rammebehandling/revurdering/stans/revurderingStansValidering';
import {
    RevurderingStansContext,
    RevurderingStansState,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import { HjemmelForStans, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const stansSkjema = (state: Partial<RevurderingStansState>): RevurderingStansContext => ({
    resultat: RevurderingResultat.STANS,
    harValgtStansFraFørsteDagSomGirRett: false,
    hjemlerForStans: [HjemmelForStans.Alder],
    fraDato: '2025-02-01',
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    erPrioritert: false,
    erReadonly: false,
    kanEndreSkalJournalføreNotat: true,
    textAreas: {
        begrunnelse: tomtTekstfelt,
        brevtekst: tomtTekstfelt,
        barnetilleggBegrunnelse: tomtTekstfelt,
        prioriteringBegrunnelse: tomtTekstfelt,
    },
    ...state,
});

describe('revurderingStansValidering', () => {
    test('godtar stans med hjemmel og fra-dato', () => {
        expect(revurderingStansValidering(stansSkjema({}))).toEqual({ errors: [], warnings: [] });
    });

    test('krever både hjemmel og fra-dato', () => {
        expect(
            revurderingStansValidering(stansSkjema({ hjemlerForStans: [], fraDato: undefined })),
        ).toEqual({
            errors: [
                'Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.',
                'Du må velge en fra-dato for når tiltakspengene skal stanses.',
            ],
            warnings: [],
        });
    });

    test('avviser tom fra-dato', () => {
        expect(revurderingStansValidering(stansSkjema({ fraDato: '' })).errors).toEqual([
            'Du må velge en fra-dato for når tiltakspengene skal stanses.',
        ]);
    });
});
