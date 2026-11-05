import { describe, expect, test } from '@jest/globals';
import {
    innvilgelsesperiode,
    periode,
    sak,
    søknad,
    søknadBarn,
    søknadsbehandlingIkkeValgt,
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
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { tilDato } from '~/types/DatoTid';
import { hentBarnFraSøknad } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';

// Barnet er under 16 år i hele tiltaksdeltakelsen (2025-01-01 - 2025-06-30)
const behandlingMedBarnISøknad = søknadsbehandlingIkkeValgt({
    søknad: søknad([søknadBarn('2015-03-01')]),
});

const barnFraSøknaden = hentBarnFraSøknad(behandlingMedBarnISøknad.søknad).atNonNull(0).barn;

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
    valgteBarn: [barnFraSøknaden],
    manueltLagtTilBarn: [],
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
                    oppdaterInnvilgelsesperiode({ fraOgMed: tilDato('2025-01-06') }),
                ),
            ).toEqual({
                harValgtPeriode: false,
                innvilgelsesperioder: [{ periode: { fraOgMed: '2025-01-06' } }],
            });
        });

        test('forhåndsutfyller innvilgelsen med barna fra søknaden når perioden blir fullstendig', () => {
            const delvisUtfylt = innvilgelsesperioderReducer(
                utenPerioderState,
                oppdaterInnvilgelsesperiode({ fraOgMed: tilDato('2025-01-06') }),
            );

            expect(
                innvilgelsesperioderReducer(
                    delvisUtfylt,
                    oppdaterInnvilgelsesperiode({ tilOgMed: tilDato('2025-03-31') }),
                ),
            ).toEqual({
                harValgtPeriode: true,
                innvilgelsesperioder: [
                    innvilgelsesperiode(periode('2025-01-06', '2025-03-31'), {
                        erReversertOpphør: false,
                    }),
                ],
                harBarnetillegg: true,
                valgteBarn: [barnFraSøknaden],
                manueltLagtTilBarn: [],
            });
        });

        test.each<InnvilgelsesperioderActions>([
            { type: 'settAntallDager', payload: { antallDager: 8, index: 0 } },
            {
                type: 'leggTilInnvilgelsesperiode',
                payload: { behandling: behandlingMedBarnISøknad, sak: sak() },
            },
        ])('kaster feil for $type', (action) => {
            expect(() => innvilgelsesperioderReducer(utenPerioderState, action)).toThrow();
        });
    });

    describe('oppdaterInnvilgelsesperiode', () => {
        test('beholder valgte barn med hele innvilgelsesperioden når perioden endres', () => {
            expect(
                innvilgelsesperioderReducer(
                    medPerioderState(),
                    oppdaterInnvilgelsesperiode({ tilOgMed: tilDato('2025-02-28') }),
                ),
            ).toEqual(
                medPerioderState({
                    innvilgelsesperioder: [
                        innvilgelsesperiode(periode('2025-01-01', '2025-02-28')),
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
                oppdaterInnvilgelsesperiode({ tilOgMed: tilDato('2025-02-15') }),
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

        test('avgrenser overstyrt periode for et barn til den nye innvilgelsesperioden', () => {
            const state = medPerioderState({
                valgteBarn: [{ ...barnFraSøknaden, periode: periode('2025-02-01', '2025-03-31') }],
            });

            const nyState = innvilgelsesperioderReducer(
                state,
                oppdaterInnvilgelsesperiode({ tilOgMed: tilDato('2025-02-28') }),
            );

            expect(nyState).toMatchObject({
                valgteBarn: [{ ...barnFraSøknaden, periode: periode('2025-02-01', '2025-02-28') }],
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
            }),
        );
    });

    test('fjernInnvilgelsesperiode fjerner perioden og tilpasser barnetillegget', () => {
        const state = medPerioderState({
            innvilgelsesperioder: [
                innvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
                innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
            ],
            valgteBarn: [{ ...barnFraSøknaden, periode: periode('2025-02-01', '2025-06-30') }],
        });

        expect(
            innvilgelsesperioderReducer(state, {
                type: 'fjernInnvilgelsesperiode',
                payload: { index: 1, behandling: behandlingMedBarnISøknad, sak: sak() },
            }),
        ).toEqual(
            medPerioderState({
                valgteBarn: [{ ...barnFraSøknaden, periode: periode('2025-02-01', '2025-03-31') }],
            }),
        );
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
                payload: { internDeltakelseId: 'deltakelse_2', erReversertOpphør: false, index: 0 },
            }).innvilgelsesperioder,
        ).toEqual([
            innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                internDeltakelseId: 'deltakelse_2',
                erReversertOpphør: false,
            }),
        ]);
    });

    test('settTiltaksdeltakelse markerer perioden som reversert opphør', () => {
        expect(
            innvilgelsesperioderReducer(medPerioderState(), {
                type: 'settTiltaksdeltakelse',
                payload: { internDeltakelseId: 'deltakelse_1', erReversertOpphør: true, index: 0 },
            }).innvilgelsesperioder,
        ).toEqual([
            innvilgelsesperiode(periode('2025-01-01', '2025-03-31'), {
                erReversertOpphør: true,
            }),
        ]);
    });
});
