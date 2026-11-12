import { tilDato } from '~/types/DatoTid';
import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggBarn,
    barnetilleggV2,
    innvilgelsesperiode,
    periode,
    revurderingForlengelse,
    sakMedInnvilgetVedtak,
} from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
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
import { BarnetilleggBarn } from '~/lib/rammebehandling/typer/Barnetillegg';
import { SakProps } from '~/lib/sak/SakTyper';

const superType = BehandlingSkjemaType.RevurderingForlengelse;

const vedtaksperiode = periode('2025-01-01', '2025-03-31');
const forlengelsesperiode = periode('2025-04-01', '2025-06-30');

const vedtakInnvilgelsesperioder = [
    innvilgelsesperiode(vedtaksperiode, {
        antallDagerPerMeldeperiode: 6,
        internDeltakelseId: 'deltakelse_vedtak',
    }),
];

const sak = sakMedInnvilgetVedtak(vedtaksperiode, {
    vedtak: { innvilgelsesperioder: vedtakInnvilgelsesperioder },
});

const nyBehandling = revurderingForlengelse({
    tiltaksdeltakelserSomKanForlenges: ['deltakelse_vedtak'],
});

// Fyller 16 år 15. mai, midt i forlengelsen
const eldsteBarn = barnetilleggBarn('2009-05-15');
const yngsteBarn = barnetilleggBarn('2020-01-01');

const lagretForlengelse = (barn: BarnetilleggBarn[]) =>
    revurderingForlengelse({
        innvilgelsesperioder: [
            innvilgelsesperiode(forlengelsesperiode, {
                antallDagerPerMeldeperiode: 6,
                internDeltakelseId: 'deltakelse_vedtak',
            }),
        ],
        barnetillegg: barnetilleggV2(barn, [forlengelsesperiode]),
    });

// Barnetillegget backend har utledet og lagret fra vedtaket som forlenges
const lagretBehandling = lagretForlengelse([eldsteBarn, yngsteBarn]);
const lagredeBarn = [skjemaBarn('2009-05-15'), skjemaBarn('2020-01-01')];

const settHarEndretBarnetillegg = (
    harEndretBarnetillegg: boolean,
    behandling: RevurderingForlengelse,
): RevurderingForlengelseActions => ({
    superType,
    type: 'settHarValgtBarnetillegg',
    payload: { harEndretBarnetillegg, behandling, sak },
});

const fjernYngsteBarn: RevurderingForlengelseActions = {
    superType,
    type: 'velgBarnetilleggBarn',
    payload: { barn: skjemaBarn('2020-01-01'), valgt: false },
};

const reduser = (
    state: RevurderingForlengelseState,
    ...actions: RevurderingForlengelseActions[]
): RevurderingForlengelseState => actions.reduce(revurderingForlengelseReducer, state);

const settTilOgMed = (
    tilOgMed: string,
    behandling: RevurderingForlengelse = nyBehandling,
    sakProps: SakProps = sak,
): RevurderingForlengelseActions => ({
    superType,
    type: 'settForlengelseTilOgMed',
    payload: { tilOgMed: tilDato(tilOgMed), behandling, sak: sakProps },
});

describe('revurderingForlengelseReducer', () => {
    test('til og med-dato gir én innvilgelsesperiode fra forlengelsen starter, med antall dager og deltakelse fra vedtaket', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(nyBehandling, sak),
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
                valgteBarn: [],
                manueltLagtTilBarn: [],
            },
        });
    });

    test('barna fra vedtaket som forlenges forhåndsvelges med hele innvilgelsesperioden', () => {
        const sakMedBarn = sakMedInnvilgetVedtak(vedtaksperiode, {
            vedtak: {
                innvilgelsesperioder: vedtakInnvilgelsesperioder,
                barnetillegg: barnetilleggV2(
                    [{ ...yngsteBarn, perioder: [periode('2025-02-01', '2025-03-31')] }],
                    [vedtaksperiode],
                ),
            },
        });

        const state = revurderingForlengelseReducer(
            forlengelseInitialState(nyBehandling, sakMedBarn),
            settTilOgMed('2025-06-30', nyBehandling, sakMedBarn),
        );

        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            valgteBarn: [skjemaBarn('2020-01-01')],
        });
    });

    test('barnetillegget backend har lagret brukes i skjemaet', () => {
        const state = forlengelseInitialState(lagretBehandling, sak);

        expect(state.harEndretBarnetillegg).toBe(false);
        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            valgteBarn: lagredeBarn,
        });
        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(true);
    });

    test('det lagrede barnetillegget gjelder ikke lenger når til og med-datoen endres', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(lagretBehandling, sak),
            settTilOgMed('2025-05-31', lagretBehandling),
        );

        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(false);
    });

    test('det lagrede barnetillegget gjelder ikke lenger når tiltaksdeltakelsen endres', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(lagretBehandling, sak),
            {
                superType,
                type: 'settForlengelseTiltaksdeltakelse',
                payload: {
                    internDeltakelseId: 'deltakelse_annen',
                    behandling: lagretBehandling,
                    sak,
                },
            },
        );

        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(false);
    });

    test('endring av barnetillegget markerer det som valgt av saksbehandler', () => {
        const state = revurderingForlengelseReducer(
            forlengelseInitialState(lagretBehandling, sak),
            fjernYngsteBarn,
        );

        expect(state.harEndretBarnetillegg).toBe(true);
        expect(state.innvilgelse).toMatchObject({ valgteBarn: [skjemaBarn('2009-05-15')] });
    });

    test('valgt periode for et barn tilpasses ny til og med-dato', () => {
        const medValgtPeriode = reduser(forlengelseInitialState(lagretBehandling, sak), {
            superType,
            type: 'settBarnetilleggPeriodevalg',
            payload: { key: skjemaBarn('2020-01-01').key, heleInnvilgelsesperioden: false },
        });

        const state = revurderingForlengelseReducer(
            medValgtPeriode,
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
            valgteBarn: [
                skjemaBarn('2009-05-15'),
                skjemaBarn('2020-01-01', { perioder: [periode('2025-04-01', '2025-05-31')] }),
            ],
        });
    });

    test('når saksbehandler angrer valget av barnetillegg, brukes det lagrede barnetillegget igjen', () => {
        const lagret = forlengelseInitialState(lagretBehandling, sak);

        const angret = reduser(
            lagret,
            fjernYngsteBarn,
            settHarEndretBarnetillegg(false, lagretBehandling),
        );

        expect(angret).toEqual(lagret);
    });

    test('lagret periode for et barn beholdes når saksbehandler angrer endringen uten å ha endret perioden', () => {
        const overstyrtPeriode = periode('2025-04-01', '2025-04-30');
        const behandling = lagretForlengelse([{ ...yngsteBarn, perioder: [overstyrtPeriode] }]);

        const state = reduser(
            forlengelseInitialState(behandling, sak),
            settHarEndretBarnetillegg(true, behandling),
            settHarEndretBarnetillegg(false, behandling),
        );

        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            valgteBarn: [skjemaBarn('2020-01-01', { perioder: [overstyrtPeriode] })],
        });
    });

    test('det lagrede barnetillegget gjenopprettes uendret når til og med-datoen settes tilbake', () => {
        const state = reduser(
            forlengelseInitialState(lagretBehandling, sak),
            settTilOgMed('2025-04-30', lagretBehandling),
            settTilOgMed('2025-06-30', lagretBehandling),
        );

        expect(state.innvilgelse).toMatchObject({
            harBarnetillegg: true,
            valgteBarn: lagredeBarn,
        });
        expect(visesUtledetBarnetillegg(state, lagretBehandling)).toBe(true);
    });

    test('saksbehandlers valg om å ikke gi barnetillegg beholdes når til og med-datoen endres', () => {
        const state = reduser(
            forlengelseInitialState(lagretBehandling, sak),
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
            forlengelseInitialState(lagretMedValgtBarnetillegg, sak),
            settHarEndretBarnetillegg(false, lagretMedValgtBarnetillegg),
        );

        expect(state.harEndretBarnetillegg).toBe(false);
        expect(visesUtledetBarnetillegg(state, lagretMedValgtBarnetillegg)).toBe(false);
    });

    test('innvilgelsesperioden kan ikke endres direkte', () => {
        expect(() =>
            revurderingForlengelseReducer(forlengelseInitialState(lagretBehandling, sak), {
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
        expect(forlengelseInitialState(nyBehandling, sak).innvilgelse.innvilgelsesperioder).toEqual(
            [{ periode: { fraOgMed: '2025-04-01' }, internDeltakelseId: 'deltakelse_vedtak' }],
        );
    });

    test('perioden er ikke valgt før både til og med-dato og tiltak er valgt', () => {
        const medTilOgMed = revurderingForlengelseReducer(
            forlengelseInitialState(behandlingMedToTiltak, sakMedToTiltak),
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
