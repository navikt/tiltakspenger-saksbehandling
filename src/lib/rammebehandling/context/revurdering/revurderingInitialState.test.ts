import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    omgjøringIkkeValgt,
    omgjøringInnvilgelse,
    omgjøringOpphør,
    periode,
    revurderingInnvilgelse,
    revurderingStans,
    sak,
    sakMedInnvilgetVedtak,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    omgjøringInitialState,
    revurderingInitialState,
} from '~/lib/rammebehandling/context/revurdering/revurderingInitialState';
import {
    HjemmelForOpphør,
    HjemmelForStans,
    OmgjørRammevedtak,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import { Omgjøringsgrad } from '~/lib/rammebehandling/typer/Rammevedtak';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';

const blankInnvilgelse = {
    harValgtPeriode: false,
    innvilgelsesperioder: [{ periode: {} }],
};

const omgjørVedtak: OmgjørRammevedtak = {
    vedtakId: 'vedtak_1',
    periode: periode('2025-01-01', '2025-06-30'),
    omgjøringsgrad: Omgjøringsgrad.HELT,
};

describe('revurderingInitialState', () => {
    describe('stans', () => {
        test('henter lagrede valg fra behandlingen', () => {
            const behandling = revurderingStans({
                vedtaksperiode: periode('2025-03-01', '2025-06-30'),
                valgtHjemmelHarIkkeRettighet: [HjemmelForStans.Alder],
                harValgtStansFraFørsteDagSomGirRett: true,
                skalSendeVedtaksbrev: false,
            });

            expect(revurderingInitialState(behandling, sak())).toEqual({
                resultat: RevurderingResultat.STANS,
                fraDato: '2025-03-01',
                hjemlerForStans: [HjemmelForStans.Alder],
                harValgtStansFraFørsteDagSomGirRett: true,
                skalSendeVedtaksbrev: false,
            });
        });

        test('har tomme valg når behandlingen ikke er utfylt', () => {
            expect(revurderingInitialState(revurderingStans(), sak())).toEqual({
                resultat: RevurderingResultat.STANS,
                fraDato: undefined,
                hjemlerForStans: [],
                harValgtStansFraFørsteDagSomGirRett: false,
                skalSendeVedtaksbrev: true,
            });
        });
    });

    describe('innvilgelse', () => {
        test('er blank når behandlingen mangler innvilgelsesperioder', () => {
            expect(revurderingInitialState(revurderingInnvilgelse(), sak())).toEqual({
                resultat: RevurderingResultat.INNVILGELSE,
                innvilgelse: blankInnvilgelse,
            });
        });

        test('henter lagrede innvilgelsesperioder og barnetillegg', () => {
            const innvilgelsesperioder = [innvilgelsesperiode(periode('2025-04-01', '2025-05-31'))];

            const behandling = revurderingInnvilgelse({
                innvilgelsesperioder,
                barnetillegg: {
                    perioder: [barnetilleggPeriode(1, periode('2025-04-01', '2025-05-31'))],
                    begrunnelse: ikkeSladdet(null),
                },
                skalSendeVedtaksbrev: false,
            });

            expect(revurderingInitialState(behandling, sak())).toEqual({
                resultat: RevurderingResultat.INNVILGELSE,
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder,
                    harBarnetillegg: true,
                    barnetilleggPerioder: [
                        barnetilleggPeriode(1, periode('2025-04-01', '2025-05-31')),
                    ],
                    skalSendeVedtaksbrev: false,
                },
            });
        });

        test('forhåndsutfyller barnetillegg fra gjeldende vedtak når behandlingen mangler barnetillegg', () => {
            const sakMedBarnetillegg = sakMedInnvilgetVedtak(periode('2025-01-01', '2025-06-30'), {
                vedtak: {
                    gjeldendeBarnetilleggPerioder: [
                        barnetilleggPeriode(2, periode('2025-01-01', '2025-06-30')),
                    ],
                },
            });

            const behandling = revurderingInnvilgelse({
                innvilgelsesperioder: [innvilgelsesperiode(periode('2025-04-01', '2025-05-31'))],
            });

            expect(revurderingInitialState(behandling, sakMedBarnetillegg)).toMatchObject({
                innvilgelse: {
                    harBarnetillegg: true,
                    barnetilleggPerioder: [
                        barnetilleggPeriode(2, periode('2025-04-01', '2025-05-31')),
                    ],
                },
            });
        });
    });

    test('omgjøring bruker initial state for omgjøringsresultatet', () => {
        expect(revurderingInitialState(omgjøringIkkeValgt(), sak())).toEqual({
            resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
        });
    });
});

describe('omgjøringInitialState', () => {
    describe('innvilgelse', () => {
        test('henter lagret vedtaksperiode, innvilgelsesperioder og barnetillegg', () => {
            const innvilgelsesperioder = [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))];

            const behandling = omgjøringInnvilgelse({
                vedtaksperiode: periode('2025-01-01', '2025-03-31'),
                innvilgelsesperioder,
                barnetillegg: {
                    perioder: [barnetilleggPeriode(1, periode('2025-02-01', '2025-03-31'))],
                    begrunnelse: ikkeSladdet(null),
                },
                skalSendeVedtaksbrev: false,
            });

            expect(omgjøringInitialState(behandling, sak())).toEqual({
                resultat: RevurderingResultat.OMGJØRING,
                vedtaksperiode: periode('2025-01-01', '2025-03-31'),
                innvilgelse: {
                    harValgtPeriode: true,
                    innvilgelsesperioder,
                    harBarnetillegg: true,
                    barnetilleggPerioder: [
                        barnetilleggPeriode(1, periode('2025-02-01', '2025-03-31')),
                    ],
                    skalSendeVedtaksbrev: false,
                },
            });
        });

        test('har lagret vedtaksperiode, men blank innvilgelse, når innvilgelsesperioder mangler', () => {
            const behandling = omgjøringInnvilgelse({
                vedtaksperiode: periode('2025-02-01', '2025-03-31'),
                innvilgelsesperioder: null,
            });

            expect(omgjøringInitialState(behandling, sak())).toEqual({
                resultat: RevurderingResultat.OMGJØRING,
                vedtaksperiode: periode('2025-02-01', '2025-03-31'),
                innvilgelse: blankInnvilgelse,
            });
        });

        test('forhåndsutfyller vedtaksperioden fra vedtakene som omgjøres ved bytte av resultat', () => {
            const behandling = omgjøringIkkeValgt({ omgjørRammevedtak: [omgjørVedtak] });

            expect(omgjøringInitialState(behandling, sak(), RevurderingResultat.OMGJØRING)).toEqual(
                {
                    resultat: RevurderingResultat.OMGJØRING,
                    vedtaksperiode: periode('2025-01-01', '2025-06-30'),
                    innvilgelse: blankInnvilgelse,
                },
            );
        });

        test('bruker lagret vedtaksperiode fremfor vedtakene som omgjøres ved bytte av resultat', () => {
            const behandling = omgjøringOpphør({
                vedtaksperiode: periode('2025-02-01', '2025-02-28'),
                omgjørRammevedtak: [omgjørVedtak],
            });

            expect(
                omgjøringInitialState(behandling, sak(), RevurderingResultat.OMGJØRING),
            ).toMatchObject({ vedtaksperiode: periode('2025-02-01', '2025-02-28') });
        });

        test('har tom vedtaksperiode når ingen vedtak omgjøres', () => {
            expect(
                omgjøringInitialState(omgjøringIkkeValgt(), sak(), RevurderingResultat.OMGJØRING),
            ).toMatchObject({ vedtaksperiode: {} });
        });
    });

    describe('opphør', () => {
        const sakMedInnvilgetTidslinje = sak({
            innvilgetTidslinje: {
                elementer: [
                    {
                        rammevedtakId: 'vedtak_1',
                        periode: periode('2025-02-01', '2025-04-30'),
                        tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                    },
                ],
            },
        });

        test('henter lagrede valg fra behandlingen', () => {
            const behandling = omgjøringOpphør({
                vedtaksperiode: periode('2025-03-01', '2025-03-31'),
                valgteHjemler: [HjemmelForOpphør.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });

            expect(omgjøringInitialState(behandling, sakMedInnvilgetTidslinje)).toEqual({
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                vedtaksperiode: periode('2025-03-01', '2025-03-31'),
                valgteHjemler: [HjemmelForOpphør.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });
        });

        test('avgrenser forhåndsutfylt vedtaksperiode til innvilgede perioder og beholder vedtaksbrev-valget ved bytte av resultat', () => {
            const behandling = omgjøringIkkeValgt({
                omgjørRammevedtak: [omgjørVedtak],
                skalSendeVedtaksbrev: false,
            });

            expect(
                omgjøringInitialState(
                    behandling,
                    sakMedInnvilgetTidslinje,
                    RevurderingResultat.OMGJØRING_OPPHØR,
                ),
            ).toEqual({
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                vedtaksperiode: periode('2025-02-01', '2025-04-30'),
                valgteHjemler: [],
                skalSendeVedtaksbrev: false,
            });
        });

        test('har tom vedtaksperiode når ingen vedtak omgjøres', () => {
            expect(
                omgjøringInitialState(
                    omgjøringIkkeValgt(),
                    sakMedInnvilgetTidslinje,
                    RevurderingResultat.OMGJØRING_OPPHØR,
                ),
            ).toMatchObject({ vedtaksperiode: {} });
        });

        test('har tom vedtaksperiode når vedtakene som omgjøres ikke overlapper innvilgede perioder', () => {
            const behandling = omgjøringIkkeValgt({
                omgjørRammevedtak: [
                    { ...omgjørVedtak, periode: periode('2025-06-01', '2025-06-30') },
                ],
            });

            expect(
                omgjøringInitialState(
                    behandling,
                    sakMedInnvilgetTidslinje,
                    RevurderingResultat.OMGJØRING_OPPHØR,
                ),
            ).toMatchObject({ vedtaksperiode: {} });
        });
    });
});
