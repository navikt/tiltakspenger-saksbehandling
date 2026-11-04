import { tilDato } from '~/types/DatoTid';
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
    forlengelseInitialState,
    RevurderingForlengelseActions,
    revurderingForlengelseReducer,
    RevurderingForlengelseState,
    visesUtledetBarnetillegg,
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

const nyBehandling = revurderingForlengelse({
    tiltaksdeltakelserSomKanForlenges: ['deltakelse_vedtak'],
});

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

// Det siste barnet fyller 16 år 15. mai, så barnetillegget slutter før forlengelsen.
const lagretBehandlingDerBarnetilleggetSlutterFør = revurderingForlengelse({
    ...lagretBehandling,
    barnetillegg: {
        perioder: [barnetilleggPeriode(1, periode('2025-04-01', '2025-05-14'))],
        begrunnelse: ikkeSladdet(null),
    },
});

const settHarEndretBarnetillegg = (
    harEndretBarnetillegg: boolean,
    behandling: RevurderingForlengelse,
): RevurderingForlengelseActions => ({
    superType,
    type: 'settHarValgtBarnetillegg',
    payload: { harEndretBarnetillegg, behandling },
});

const reduser = (
    state: RevurderingForlengelseState,
    ...actions: RevurderingForlengelseActions[]
): RevurderingForlengelseState => actions.reduce(revurderingForlengelseReducer, state);

const settTilOgMed = (
    tilOgMed: string,
    behandling: RevurderingForlengelse = nyBehandling,
): RevurderingForlengelseActions => ({
    superType,
    type: 'settForlengelseTilOgMed',
    payload: { tilOgMed: tilDato(tilOgMed), behandling, sak },
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
        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(true);
    });

    test('det lagrede barnetillegget gjelder ikke lenger når til og med-datoen endres', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(lagretBehandling),
            settTilOgMed('2025-05-31', lagretBehandling),
        );

        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(false);
    });

    test('det lagrede barnetillegget gjelder ikke lenger når tiltaksdeltakelsen endres', () => {
        const state = revurderingForlengelseReducer(forlengelseInitialState(lagretBehandling), {
            superType,
            type: 'settForlengelseTiltaksdeltakelse',
            payload: { internDeltakelseId: 'deltakelse_annen', behandling: lagretBehandling, sak },
        });

        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(false);
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

    test('det lagrede barnetillegget strekkes ikke ut når saksbehandler angrer endringen uten å ha endret perioden', () => {
        const state = reduser(
            forlengelseInitialState(lagretBehandlingDerBarnetilleggetSlutterFør),
            settHarEndretBarnetillegg(true, lagretBehandlingDerBarnetilleggetSlutterFør),
            settHarEndretBarnetillegg(false, lagretBehandlingDerBarnetilleggetSlutterFør),
        );

        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-04-01', '2025-05-14'))],
        });
    });

    test('det lagrede barnetillegget gjenopprettes uendret når til og med-datoen settes tilbake', () => {
        const state = reduser(
            forlengelseInitialState(lagretBehandling),
            settTilOgMed('2025-04-30', lagretBehandling),
            settTilOgMed('2025-06-30', lagretBehandling),
        );

        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            barnetilleggPerioder: utledetBarnetillegg,
        });
        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(true);
    });

    test('saksbehandlers valg om å ikke gi barnetillegg beholdes når til og med-datoen endres', () => {
        const state = reduser(
            forlengelseInitialState(lagretBehandling),
            { superType, type: 'setHarSøktBarnetillegg', payload: { harSøkt: false } },
            settTilOgMed('2025-05-31', lagretBehandling),
        );

        expect(state.harEndretBarnetillegg).toBe(true);
        expect(state.innvilgelse).toMatchObject({ harBarnetillegg: false });
    });

    test('barnetillegg saksbehandler valgte da behandlingen ble lagret, vises ikke som utledet når valget angres', () => {
        const lagretMedValgtBarnetillegg = revurderingForlengelse({
            ...lagretBehandling,
            harEndretBarnetillegg: true,
        });

        const state = reduser(
            forlengelseInitialState(lagretMedValgtBarnetillegg),
            settHarEndretBarnetillegg(false, lagretMedValgtBarnetillegg),
        );

        expect(state.harEndretBarnetillegg).toBe(false);
        expect(visesUtledetBarnetillegg(state, lagretMedValgtBarnetillegg)).toBe(false);
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

describe('valg av tiltaksdeltakelse ved forlengelse', () => {
    const sakMedToTiltak = sakMedInnvilgetVedtak(vedtaksperiode, {
        vedtak: {
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31'), {
                    antallDagerPerMeldeperiode: 4,
                    internDeltakelseId: 'deltakelse_tidlig',
                }),
                innvilgelsesperiode(periode('2025-02-01', '2025-02-28'), {
                    antallDagerPerMeldeperiode: 8,
                    internDeltakelseId: 'deltakelse_vedtak',
                }),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31'), {
                    antallDagerPerMeldeperiode: 6,
                    internDeltakelseId: 'deltakelse_tidlig',
                }),
            ],
        },
    });

    const behandlingMedToTiltak = revurderingForlengelse({
        tiltaksdeltakelserSomKanForlenges: ['deltakelse_tidlig', 'deltakelse_vedtak'],
    });

    test('tiltaket er forhåndsvalgt når vedtaket bare kan forlenges for ett tiltak', () => {
        expect(forlengelseInitialState(nyBehandling).innvilgelse.innvilgelsesperioder).toEqual([
            { periode: { fraOgMed: '2025-04-01' }, internDeltakelseId: 'deltakelse_vedtak' },
        ]);
    });

    test('perioden er ikke valgt før både til og med-dato og tiltak er valgt', () => {
        const medTilOgMed = revurderingForlengelseReducer(
            forlengelseInitialState(behandlingMedToTiltak),
            {
                superType,
                type: 'settForlengelseTilOgMed',
                payload: {
                    tilOgMed: tilDato('2025-06-30'),
                    behandling: behandlingMedToTiltak,
                    sak: sakMedToTiltak,
                },
            },
        );

        expect(medTilOgMed.innvilgelse).toEqual({
            harValgtPeriode: false,
            innvilgelsesperioder: [{ periode: forlengelsesperiode, internDeltakelseId: undefined }],
        });

        const medTiltak = revurderingForlengelseReducer(medTilOgMed, {
            superType,
            type: 'settForlengelseTiltaksdeltakelse',
            payload: {
                internDeltakelseId: 'deltakelse_vedtak',
                behandling: behandlingMedToTiltak,
                sak: sakMedToTiltak,
            },
        });

        // Antall dager hentes fra den siste perioden vedtaket innvilget for tiltaket, ikke fra slutten av vedtaket.
        expect(medTiltak.innvilgelse).toMatchObject({
            harValgtPeriode: true,
            innvilgelsesperioder: [
                innvilgelsesperiode(forlengelsesperiode, {
                    antallDagerPerMeldeperiode: 8,
                    internDeltakelseId: 'deltakelse_vedtak',
                }),
            ],
        });
    });
});
