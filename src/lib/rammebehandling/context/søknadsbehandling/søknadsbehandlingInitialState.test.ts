import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggBarn,
    barnetilleggPeriode,
    barnetilleggV1,
    barnetilleggV2,
    innvilgelsesperiode,
    periode,
    søknad,
    søknadBarn,
    søknadsbehandlingAvslag,
    søknadsbehandlingIkkeValgt,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
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
        test('henter lagrede avslagsgrunner', () => {
            const behandling = søknadsbehandlingAvslag({
                avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.FremmetForSent],
            });

            expect(søknadsbehandlingInitialState(behandling)).toEqual({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.FremmetForSent],
            });
        });

        test('har ingen avslagsgrunner når lagret behandling har annet resultat', () => {
            const behandling = søknadsbehandlingIkkeValgt();

            expect(
                søknadsbehandlingInitialState(behandling, SøknadsbehandlingResultat.AVSLAG),
            ).toEqual({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [],
            });
        });
    });

    describe('innvilgelse', () => {
        test('henter lagrede innvilgelsesperioder og de lagrede barna', () => {
            const innvilgelsesperioder = [
                innvilgelsesperiode(periode('2025-01-01', '2025-02-28')),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31'), {
                    antallDagerPerMeldeperiode: 6,
                }),
            ];

            const overstyrtPeriode = periode('2025-01-01', '2025-01-31');

            const behandling = søknadsbehandlingInnvilgelse({
                innvilgelsesperioder,
                // Barnet fra søknaden skal ikke forhåndsvelges når barna er lagret
                søknad: søknad([søknadBarn('2015-03-01')]),
                barnetillegg: barnetilleggV2(
                    [barnetilleggBarn('2020-01-01', { periode: overstyrtPeriode })],
                    innvilgelsesperioder.map((it) => it.periode),
                ),
            });

            expect(søknadsbehandlingInitialState(behandling)).toEqual({
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder,
                    harBarnetillegg: true,
                    valgteBarn: [skjemaBarn('2020-01-01', { periode: overstyrtPeriode })],
                    manueltLagtTilBarn: [],
                },
            });
        });

        test('har ikke barnetillegg når de lagrede barna er en tom liste', () => {
            const behandling = søknadsbehandlingInnvilgelse({
                søknad: søknad([søknadBarn('2015-03-01')]),
                barnetillegg: barnetilleggV2([], [periode('2025-01-01', '2025-03-31')]),
            });

            expect(søknadsbehandlingInitialState(behandling)).toMatchObject({
                innvilgelse: { harBarnetillegg: false, valgteBarn: [] },
            });
        });

        test('forhåndsvelger barna fra søknaden når barnetillegget er lagret som antall barn per periode', () => {
            const behandling = søknadsbehandlingInnvilgelse({
                søknad: søknad([søknadBarn('2015-03-01')]),
                barnetillegg: barnetilleggV1([
                    barnetilleggPeriode(1, periode('2025-01-01', '2025-01-31')),
                    barnetilleggPeriode(0, periode('2025-02-01', '2025-03-31')),
                ]),
            });

            expect(søknadsbehandlingInitialState(behandling)).toMatchObject({
                innvilgelse: {
                    harBarnetillegg: true,
                    valgteBarn: [
                        expect.objectContaining({
                            fødselsdato: { verdi: '2015-03-01', erSladdet: false },
                            periode: null,
                        }),
                    ],
                },
            });
        });

        test('har ikke barnetillegg når lagrede perioder kun har 0 barn', () => {
            const behandling = søknadsbehandlingInnvilgelse({
                søknad: søknad([søknadBarn('2015-03-01')]),
                barnetillegg: barnetilleggV1([
                    barnetilleggPeriode(0, periode('2025-01-01', '2025-03-31')),
                ]),
            });

            expect(søknadsbehandlingInitialState(behandling)).toMatchObject({
                innvilgelse: { harBarnetillegg: false, valgteBarn: [] },
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
