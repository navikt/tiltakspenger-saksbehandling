import { describe, expect, test } from '@jest/globals';
import {
    barnetilleggPeriode,
    innvilgelsesperiode,
    periode,
    revurderingInnvilgelse,
    sak,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
    søknadsbehandlingIkkeValgt,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import {
    InnvilgelseMedPerioderState,
    InnvilgelseUtenPerioderState,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import {
    InnvilgelsesperioderActions,
    innvilgelsesperioderReducer,
} from '~/lib/rammebehandling/context/innvilgelse/slices/innvilgelsesperiodeContext';
import { Periode } from '~/types/Periode';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';

// Barnet er under 16 år i hele tiltaksdeltakelsen (2025-01-01 - 2025-06-30)
const behandlingMedBarnISøknad = søknadsbehandlingIkkeValgt({
    søknad: søknad([søknadBarn('2015-03-01')]),
});

const behandlingUtenBarnISøknad = søknadsbehandlingIkkeValgt();

const utenPerioderState: InnvilgelseUtenPerioderState = {
    harValgtPeriode: false,
    innvilgelsesperioder: [{ periode: {} }],
};

const medPerioderState = (
    overstyringer: Partial<InnvilgelseMedPerioderState> = {},
): InnvilgelseMedPerioderState => ({
    harValgtPeriode: true,
    innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
    harBarnetillegg: true,
    barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-01-01', '2025-03-31'))],
    skalSendeVedtaksbrev: true,
    ...overstyringer,
});

const oppdaterInnvilgelsesperiode = (
    periodeOppdatering: Partial<Periode>,
    index: number = 0,
    behandling: Rammebehandling = behandlingMedBarnISøknad,
    sakProps = sak(),
): InnvilgelsesperioderActions => ({
    type: 'oppdaterInnvilgelsesperiode',
    payload: { periodeOppdatering, index, behandling, sak: sakProps },
});

describe('innvilgelsesperioderReducer', () => {
    describe('før innvilgelsesperioden er valgt', () => {
        test('beholder en delvis utfylt periode', () => {
            expect(
                innvilgelsesperioderReducer(
                    utenPerioderState,
                    oppdaterInnvilgelsesperiode({ fraOgMed: '2025-01-06' }),
                ),
            ).toEqual({
                harValgtPeriode: false,
                innvilgelsesperioder: [{ periode: { fraOgMed: '2025-01-06' } }],
            });
        });

        test('forhåndsutfyller innvilgelsen når perioden blir fullstendig', () => {
            const delvisUtfylt = innvilgelsesperioderReducer(
                utenPerioderState,
                oppdaterInnvilgelsesperiode({ fraOgMed: '2025-01-06' }),
            );

            expect(
                innvilgelsesperioderReducer(
                    delvisUtfylt,
                    oppdaterInnvilgelsesperiode({ tilOgMed: '2025-03-31' }),
                ),
            ).toEqual({
                harValgtPeriode: true,
                innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-06', '2025-03-31'))],
                harBarnetillegg: true,
                barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-01-06', '2025-03-31'))],
                skalSendeVedtaksbrev: true,
            });
        });

        test.each<InnvilgelsesperioderActions>([
            { type: 'settAntallDager', payload: { antallDager: 8, index: 0 } },
            { type: 'setSkalSendeVedtaksbrev', payload: { skalSendeVedtaksbrev: false } },
            {
                type: 'leggTilInnvilgelsesperiode',
                payload: { behandling: behandlingMedBarnISøknad, sak: sak() },
            },
        ])('kaster feil for $type', (action) => {
            expect(() => innvilgelsesperioderReducer(utenPerioderState, action)).toThrow();
        });
    });

    describe('oppdaterInnvilgelsesperiode', () => {
        test('periodiserer barnetillegg fra søknaden på nytt når det ikke er endret av saksbehandler', () => {
            expect(
                innvilgelsesperioderReducer(
                    medPerioderState(),
                    oppdaterInnvilgelsesperiode({ tilOgMed: '2025-02-28' }),
                ),
            ).toEqual(
                medPerioderState({
                    innvilgelsesperioder: [
                        innvilgelsesperiode(periode('2025-01-01', '2025-02-28')),
                    ],
                    barnetilleggPerioder: [
                        barnetilleggPeriode(1, periode('2025-01-01', '2025-02-28')),
                    ],
                }),
            );
        });

        test('justerer andre innvilgelsesperioder slik at de ikke overlapper', () => {
            const state = medPerioderState({
                innvilgelsesperioder: [
                    innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                    innvilgelsesperiode(periode('2025-02-01', '2025-03-31'), {
                        antallDagerPerMeldeperiode: 6,
                    }),
                ],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterInnvilgelsesperiode({ tilOgMed: '2025-02-15' }),
            );

            expect(nyState).toMatchObject({
                innvilgelsesperioder: [
                    innvilgelsesperiode(periode('2025-01-01', '2025-02-15')),
                    innvilgelsesperiode(periode('2025-02-16', '2025-03-31'), {
                        antallDagerPerMeldeperiode: 6,
                    }),
                ],
            });
        });

        test('utvider manuelt lagt til barnetillegg til ny periode', () => {
            const state = medPerioderState({
                barnetilleggPerioder: [barnetilleggPeriode(2, periode('2025-01-01', '2025-03-31'))],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterInnvilgelsesperiode(
                    { tilOgMed: '2025-04-30' },
                    0,
                    behandlingUtenBarnISøknad,
                ),
            );

            expect(nyState).toMatchObject({
                barnetilleggPerioder: [barnetilleggPeriode(2, periode('2025-01-01', '2025-04-30'))],
            });
        });

        test('bruker søknaden fra vedtatt søknadsbehandling for revurderinger', () => {
            const sakMedBarnISøknad = sakMedInnvilgetVedtak(periode('2025-01-01', '2025-06-30'), {
                søknadsbehandling: søknadsbehandlingInnvilgelse({
                    id: 'beh_vedtatt',
                    status: Rammebehandlingsstatus.VEDTATT,
                    iverksattTidspunkt: '2025-01-01T09:00:00',
                    søknad: søknad([søknadBarn('2015-03-01')]),
                }),
            });

            const state = medPerioderState({
                innvilgelsesperioder: [innvilgelsesperiode(periode('2025-04-01', '2025-04-30'))],
                harBarnetillegg: false,
                barnetilleggPerioder: [],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterInnvilgelsesperiode(
                    { tilOgMed: '2025-05-31' },
                    0,
                    revurderingInnvilgelse(),
                    sakMedBarnISøknad,
                ),
            );

            expect(nyState).toMatchObject({
                barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-04-01', '2025-05-31'))],
            });
        });
    });

    test('leggTilInnvilgelsesperiode legger til en kopi av siste periode ut tiltaksdeltakelsen', () => {
        const state = medPerioderState({
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                    antallDagerPerMeldeperiode: 8,
                }),
            ],
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'leggTilInnvilgelsesperiode',
                payload: { behandling: behandlingMedBarnISøknad, sak: sak() },
            }),
        ).toEqual(
            medPerioderState({
                innvilgelsesperioder: [
                    innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                        antallDagerPerMeldeperiode: 8,
                    }),
                    innvilgelsesperiode(periode('2025-04-01', '2025-06-30'), {
                        antallDagerPerMeldeperiode: 8,
                    }),
                ],
                barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-01-01', '2025-06-30'))],
            }),
        );
    });

    test('fjernInnvilgelsesperiode fjerner perioden og tilpasser barnetillegget', () => {
        const state = medPerioderState({
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
                innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
            ],
            barnetilleggPerioder: [barnetilleggPeriode(1, periode('2025-01-01', '2025-06-30'))],
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'fjernInnvilgelsesperiode',
                payload: { index: 1, behandling: behandlingMedBarnISøknad, sak: sak() },
            }),
        ).toEqual(medPerioderState());
    });

    test('settAntallDager endrer kun valgt periode', () => {
        const state = medPerioderState({
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
                innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
            ],
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'settAntallDager',
                payload: { antallDager: 4, index: 1 },
            }).innvilgelsesperioder,
        ).toEqual([
            innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
            innvilgelsesperiode(periode('2025-04-01', '2025-06-30'), {
                antallDagerPerMeldeperiode: 4,
            }),
        ]);
    });

    test('settTiltaksdeltakelse endrer kun valgt periode', () => {
        expect(
            innvilgelsesperioderReducer(medPerioderState(), {
                type: 'settTiltaksdeltakelse',
                payload: { internDeltakelseId: 'deltakelse_2', index: 0 },
            }).innvilgelsesperioder,
        ).toEqual([
            innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                internDeltakelseId: 'deltakelse_2',
            }),
        ]);
    });

    test('setSkalSendeVedtaksbrev setter vedtaksbrev-valget', () => {
        expect(
            innvilgelsesperioderReducer(medPerioderState(), {
                type: 'setSkalSendeVedtaksbrev',
                payload: { skalSendeVedtaksbrev: false },
            }),
        ).toEqual(medPerioderState({ skalSendeVedtaksbrev: false }));
    });
});
