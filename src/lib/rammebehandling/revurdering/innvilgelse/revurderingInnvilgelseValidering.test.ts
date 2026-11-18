import { describe, expect, test } from '@jest/globals';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    barnetilleggKandidat,
    innvilgelsesperiode,
    innvilgelsesperioder,
    periode,
    revurderingInnvilgelse,
    sak,
} from '~test/rammebehandling';

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const førsteHalvår = periode('2025-01-01', '2025-06-30');

const skjemaUtenBarnetillegg: RevurderingInnvilgelseContext = {
    resultat: RevurderingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: innvilgelsesperioder([innvilgelsesperiode(førsteHalvår)]),
        harBarnetillegg: false,
        valgteBarn: [],
        manueltLagtTilBarn: [],
    },
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
};

// Backend gir barna fra søknaden med tiltaksdeltakelsen søknaden er innvilget for
const revurderingMedBarnFraSøknad = (internDeltakelseId: string) =>
    revurderingInnvilgelse({
        barnetilleggKandidater: [
            barnetilleggKandidat('2020-05-05', { internDeltakelseIder: [internDeltakelseId] }),
        ],
    });

describe('revurderingInnvilgelseValidering', () => {
    test('validerer ikke barnetillegg mot innvilgede søknader for andre tiltaksdeltakelser', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingMedBarnFraSøknad('deltakelse_annen'),
            skjemaUtenBarnetillegg,
            sak(),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('advarer om manglende barnetillegg når den innvilgede søknaden for tiltaksdeltakelsen har barn', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingMedBarnFraSøknad('deltakelse_1'),
            skjemaUtenBarnetillegg,
            sak(),
        );

        expect(resultat).toEqual({
            errors: [],
            warnings: [
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Barn fra søknaden med rett i innvilgelsesperioden: Barn Barnesen (født 05.05.2020)',
            ],
        });
    });

    test('avviser en lagret innvilgelse som backend har validert at ikke passer med tiltaksdeltakelsen', () => {
        const innvilgetPeriode = periode('2025-01-01', '2025-06-30');

        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse({
                innvilgelsesperioder: {
                    ...innvilgelsesperioder([innvilgelsesperiode(innvilgetPeriode)]),
                    tiltak: [
                        {
                            ...innvilgelsesperiode(innvilgetPeriode),
                            perioder: [
                                {
                                    periode: innvilgetPeriode,
                                    ugyldigTiltaksdeltakelse: {
                                        type: 'KAN_IKKE_INNVILGES',
                                        deltakelsesperiode: null,
                                    },
                                },
                            ],
                        },
                    ],
                },
            }),
            {
                ...skjemaUtenBarnetillegg,
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder: innvilgelsesperioder([
                        innvilgelsesperiode(innvilgetPeriode),
                    ]),
                    harBarnetillegg: false,
                    valgteBarn: [],
                    manueltLagtTilBarn: [],
                },
            },
            sak(),
        );

        expect(resultat.errors).toEqual(['Kan ikke innvilge for valgt tiltaksdeltakelse']);
    });
});
