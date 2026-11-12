import { describe, expect, test } from '@jest/globals';
import { søknadsbehandlingValidering } from '~/lib/rammebehandling/søknadsbehandling/handlinger/søknadsbehandlingValidering';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { BehandlingSkjemaResultatState } from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    innvilgelsesperiode,
    periode,
    sak,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const skjema = (state: BehandlingSkjemaResultatState): BehandlingSkjemaContext => ({
    ...state,
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
});

const behandling = søknadsbehandlingInnvilgelse();

describe('søknadsbehandlingValidering', () => {
    test('manglende resultat er en advarsel ved lagring, men en feil ved sending til beslutter', () => {
        const valider = søknadsbehandlingValidering(
            sak(),
            behandling,
            skjema({ resultat: SøknadsbehandlingResultat.IKKE_VALGT }),
        );

        expect(valider('lagring')).toEqual({
            errors: [],
            warnings: ['Behandlingsresultat mangler'],
        });
        expect(valider('tilBeslutning')).toEqual({
            errors: ['Behandlingsresultat mangler'],
            warnings: [],
        });
    });

    test('krever minst en avslagsgrunn ved avslag', () => {
        const valider = søknadsbehandlingValidering(
            sak(),
            behandling,
            skjema({ resultat: SøknadsbehandlingResultat.AVSLAG, avslagsgrunner: [] }),
        );

        expect(valider('lagring')).toEqual({ errors: ['Avslagsgrunn må velges'], warnings: [] });
    });

    test('godtar avslag med avslagsgrunn', () => {
        const valider = søknadsbehandlingValidering(
            sak(),
            behandling,
            skjema({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [Avslagsgrunn.Alder],
            }),
        );

        expect(valider('tilBeslutning')).toEqual({ errors: [], warnings: [] });
    });

    test('validerer innvilgelse mot søknaden i behandlingen', () => {
        const behandlingMedBarnISøknaden = søknadsbehandlingInnvilgelse({
            søknad: søknad([søknadBarn('2020-05-05')]),
        });

        const valider = søknadsbehandlingValidering(
            sak(),
            behandlingMedBarnISøknaden,
            skjema({
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder: [
                        innvilgelsesperiode(periode('2025-01-01', '2025-07-31')),
                    ],
                    harBarnetillegg: false,
                    valgteBarn: [],
                    manueltLagtTilBarn: [],
                },
            }),
        );

        expect(valider('tilBeslutning')).toEqual({
            errors: [],
            warnings: [
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Barn fra søknaden med rett i innvilgelsesperioden: Barn Barnesen (født 05.05.2020)',
            ],
        });
    });

    test('avviser resultater som ikke hører til en søknadsbehandling', () => {
        const valider = søknadsbehandlingValidering(
            sak(),
            behandling,
            skjema({
                resultat: RevurderingResultat.STANS,
                hjemlerForStans: [],
                harValgtStansFraFørsteDagSomGirRett: false,
            }),
        );

        expect(valider('lagring').errors).toEqual([
            'Ugyldig resultat for søknadsbehandling: STANS',
        ]);
    });
});
