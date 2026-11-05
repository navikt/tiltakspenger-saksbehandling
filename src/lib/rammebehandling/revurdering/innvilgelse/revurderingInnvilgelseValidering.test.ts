import { describe, expect, test } from '@jest/globals';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    innvilgelsesperiode,
    periode,
    revurderingInnvilgelse,
    sak,
    søknad,
    søknadBarn,
} from '~test/rammebehandling';

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const førsteHalvår = periode('2025-01-01', '2025-06-30');

const skjemaUtenBarnetillegg: RevurderingInnvilgelseContext = {
    resultat: RevurderingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: [innvilgelsesperiode(førsteHalvår)],
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

const søknadMedBarn = (internDeltakelseId: string) => {
    const standard = søknad([søknadBarn('2020-05-05')]);
    return { ...standard, tiltak: { ...standard.tiltak, internDeltakelseId } };
};

describe('revurderingInnvilgelseValidering', () => {
    test('validerer ikke barnetillegg mot søknader for andre tiltaksdeltakelser', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sak({ søknader: [søknadMedBarn('deltakelse_annen')] }),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('advarer om manglende barnetillegg når søknaden for tiltaksdeltakelsen har barn', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sak({ søknader: [søknadMedBarn('deltakelse_1')] }),
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
                innvilgelsesperioder: [
                    {
                        ...innvilgelsesperiode(innvilgetPeriode),
                        ugyldigTiltaksdeltakelse: {
                            type: 'KAN_IKKE_INNVILGES',
                            deltakelsesperiode: null,
                        },
                    },
                ],
            }),
            {
                ...skjemaUtenBarnetillegg,
                innvilgelse: {
                    ...skjemaUtenBarnetillegg.innvilgelse,
                    innvilgelsesperioder: [innvilgelsesperiode(innvilgetPeriode)],
                },
            },
            sak(),
        );

        expect(resultat.errors).toEqual(['Kan ikke innvilge for valgt tiltaksdeltakelse']);
    });
});
