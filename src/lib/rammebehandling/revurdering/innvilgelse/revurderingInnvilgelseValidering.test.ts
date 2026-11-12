import { describe, expect, test } from '@jest/globals';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    innvilgelsesperiode,
    periode,
    revurderingInnvilgelse,
    sak,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';

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

const sakMedInnvilgetSøknadMedBarn = (internDeltakelseId: string) =>
    sakMedInnvilgetVedtak(førsteHalvår, {
        søknadsbehandling: søknadsbehandlingInnvilgelse({
            id: 'beh_vedtatt',
            status: Rammebehandlingsstatus.VEDTATT,
            søknad: søknad([søknadBarn('2020-05-05')]),
            innvilgelsesperioder: [innvilgelsesperiode(førsteHalvår, { internDeltakelseId })],
        }),
    });

describe('revurderingInnvilgelseValidering', () => {
    test('validerer ikke barnetillegg mot innvilgede søknader for andre tiltaksdeltakelser', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sakMedInnvilgetSøknadMedBarn('deltakelse_annen'),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('advarer om manglende barnetillegg når den innvilgede søknaden for tiltaksdeltakelsen har barn', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sakMedInnvilgetSøknadMedBarn('deltakelse_1'),
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
