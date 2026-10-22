import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    periode,
    søknadsbehandlingAvslag,
    søknadsbehandlingIkkeValgt,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { søknadsbehandlingInitialState } from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingInitialState';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';

const blankInnvilgelse = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: false,
        innvilgelsesperioder: [{ periode: {} }],
    },
};

describe('søknadsbehandlingInitialState', () => {
    test('ikke valgt resultat har ingen andre felter', () => {
        expect(søknadsbehandlingInitialState(søknadsbehandlingIkkeValgt())).toEqual({
            resultat: SøknadsbehandlingResultat.IKKE_VALGT,
        });
    });

    describe('avslag', () => {
        test('henter lagrede avslagsgrunner og vedtaksbrev-valg', () => {
            const behandling = søknadsbehandlingAvslag({
                avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });

            expect(søknadsbehandlingInitialState(behandling)).toEqual({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });
        });

        test('har ingen avslagsgrunner når lagret behandling har annet resultat', () => {
            const behandling = søknadsbehandlingIkkeValgt();

            expect(
                søknadsbehandlingInitialState(behandling, SøknadsbehandlingResultat.AVSLAG),
            ).toEqual({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [],
                skalSendeVedtaksbrev: true,
            });
        });
    });

    describe('innvilgelse', () => {
        test('henter lagrede innvilgelsesperioder og barnetillegg med barn', () => {
            const innvilgelsesperioder = [
                innvilgelsesperiode(periode('2025-01-01', '2025-02-28')),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31'), {
                    antallDagerPerMeldeperiode: 6,
                }),
            ];

            const behandling = søknadsbehandlingInnvilgelse({
                innvilgelsesperioder,
                barnetillegg: {
                    perioder: [
                        barnetilleggPeriode(1, periode('2025-01-01', '2025-01-31')),
                        barnetilleggPeriode(0, periode('2025-02-01', '2025-03-31')),
                    ],
                    begrunnelse: ikkeSladdet(null),
                },
                skalSendeVedtaksbrev: false,
            });

            expect(søknadsbehandlingInitialState(behandling)).toEqual({
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder,
                    harBarnetillegg: true,
                    barnetilleggPerioder: [
                        barnetilleggPeriode(1, periode('2025-01-01', '2025-01-31')),
                    ],
                    skalSendeVedtaksbrev: false,
                },
            });
        });

        test('har ikke barnetillegg når lagrede perioder kun har 0 barn', () => {
            const behandling = søknadsbehandlingInnvilgelse({
                barnetillegg: {
                    perioder: [barnetilleggPeriode(0, periode('2025-01-01', '2025-03-31'))],
                    begrunnelse: ikkeSladdet(null),
                },
            });

            const state = søknadsbehandlingInitialState(behandling);

            expect(state).toMatchObject({
                innvilgelse: { harBarnetillegg: false, barnetilleggPerioder: [] },
            });
        });

        test('er blank når lagret behandling har annet resultat', () => {
            const behandling = søknadsbehandlingAvslag();

            expect(
                søknadsbehandlingInitialState(behandling, SøknadsbehandlingResultat.INNVILGELSE),
            ).toEqual(blankInnvilgelse);
        });
    });
});
