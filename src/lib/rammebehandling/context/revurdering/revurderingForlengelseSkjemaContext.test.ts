import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    periode,
    revurderingForlengelse,
    sakMedInnvilgetVedtak,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    erLagretMedSammeTilOgMed,
    forlengelseInitialState,
    RevurderingForlengelseActions,
    revurderingForlengelseReducer,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import {
    RevurderingForlengelse,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';

const superType = BehandlingSkjemaType.RevurderingForlengelse;

const vedtaksperiode = periode('2025-01-01', '2025-03-31');
const forlengelsesperiode = periode('2025-04-01', '2025-06-30');

const sak = sakMedInnvilgetVedtak(vedtaksperiode, {
    vedtak: {
        innvilgelsesperioder: [
            innvilgelsesperiode(vedtaksperiode, {
                antallDagerPerMeldeperiode: 6,
                internDeltakelseId: 'deltakelse_vedtak',
            }),
        ],
        gjeldendeBarnetilleggPerioder: [barnetilleggPeriode(2, vedtaksperiode)],
    },
});

const nyBehandling = revurderingForlengelse();

// Barnetillegget backend har utledet og lagret, der ett av barna fyller 16 år i forlengelsen.
const utledetBarnetillegg = [
    barnetilleggPeriode(2, periode('2025-04-01', '2025-05-14')),
    barnetilleggPeriode(1, periode('2025-05-15', '2025-06-30')),
];

const lagretBehandling = revurderingForlengelse({
    innvilgelsesperioder: [
        innvilgelsesperiode(forlengelsesperiode, {
            antallDagerPerMeldeperiode: 6,
            internDeltakelseId: 'deltakelse_vedtak',
        }),
    ],
    barnetillegg: { perioder: utledetBarnetillegg, begrunnelse: ikkeSladdet(null) },
});

const settTilOgMed = (
    tilOgMed: string,
    behandling: RevurderingForlengelse = nyBehandling,
): RevurderingForlengelseActions => ({
    superType,
    type: 'settForlengelseTilOgMed',
    payload: { tilOgMed, behandling, sak },
});

describe('revurderingForlengelseReducer', () => {
    test('til og med-dato gir én innvilgelsesperiode fra forlengelsen starter, med antall dager og deltakelse fra vedtaket', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(nyBehandling),
            settTilOgMed('2025-06-30'),
        );

        expect(state).toEqual({
            resultat: RevurderingResultat.FORLENGELSE,
            forlengesFraOgMed: '2025-04-01',
            harEndretBarnetillegg: false,
            innvilgelse: {
                harValgtPeriode: true,
                innvilgelsesperioder: [
                    innvilgelsesperiode(forlengelsesperiode, {
                        antallDagerPerMeldeperiode: 6,
                        internDeltakelseId: 'deltakelse_vedtak',
                    }),
                ],
                harBarnetillegg: false,
                barnetilleggPerioder: [],
                skalSendeVedtaksbrev: true,
            },
        });
    });

    test('barnetillegget backend har lagret brukes i skjemaet', () => {
        const state = forlengelseInitialState(lagretBehandling);

        expect(state.harEndretBarnetillegg).toBe(false);
        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            barnetilleggPerioder: utledetBarnetillegg,
        });
        expect(erLagretMedSammeTilOgMed(state, lagretBehandling)).toBe(true);
    });

    test('det lagrede barnetillegget gjelder ikke lenger når til og med-datoen endres', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(lagretBehandling),
            settTilOgMed('2025-05-31', lagretBehandling),
        );

        expect(erLagretMedSammeTilOgMed(state, lagretBehandling)).toBe(false);
    });

    test('endring av barnetillegget markerer det som valgt av saksbehandler', () => {
        const state = revurderingForlengelseReducer(forlengelseInitialState(lagretBehandling), {
            superType,
            type: 'oppdaterBarnetilleggAntall',
            payload: { antall: 3, index: 0 },
        });

        expect(state.harEndretBarnetillegg).toBe(true);
        expect(state.innvilgelse).toMatchObject({
            barnetilleggPerioder: [
                barnetilleggPeriode(3, periode('2025-04-01', '2025-05-14')),
                barnetilleggPeriode(1, periode('2025-05-15', '2025-06-30')),
            ],
        });
    });

    test('valgt barnetillegg tilpasses ny til og med-dato', () => {
        const medValgtBarnetillegg = {
            ...forlengelseInitialState(lagretBehandling),
            harEndretBarnetillegg: true,
        };

        const state = revurderingForlengelseReducer(
            medValgtBarnetillegg,
            settTilOgMed('2025-05-31', lagretBehandling),
        );

        expect(state.harEndretBarnetillegg).toBe(true);
        expect(state.innvilgelse).toMatchObject({
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-04-01', '2025-05-31'), {
                    antallDagerPerMeldeperiode: 6,
                    internDeltakelseId: 'deltakelse_vedtak',
                }),
            ],
            barnetilleggPerioder: [
                barnetilleggPeriode(2, periode('2025-04-01', '2025-05-14')),
                barnetilleggPeriode(1, periode('2025-05-15', '2025-05-31')),
            ],
        });
    });

    test('når saksbehandler angrer valget av barnetillegg, brukes det lagrede barnetillegget igjen', () => {
        const lagret = forlengelseInitialState(lagretBehandling);

        const endret = revurderingForlengelseReducer(lagret, {
            superType,
            type: 'oppdaterBarnetilleggAntall',
            payload: { antall: 3, index: 0 },
        });

        const angret = revurderingForlengelseReducer(endret, {
            superType,
            type: 'settHarValgtBarnetillegg',
            payload: { harEndretBarnetillegg: false, behandling: lagretBehandling },
        });

        expect(angret).toEqual(lagret);
    });

    test('innvilgelsesperioden kan ikke endres direkte', () => {
        expect(() =>
            revurderingForlengelseReducer(forlengelseInitialState(lagretBehandling), {
                superType,
                type: 'settAntallDager',
                payload: { antallDager: 2, index: 0 },
            }),
        ).toThrow();
    });
});
