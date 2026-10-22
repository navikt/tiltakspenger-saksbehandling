import { describe, expect, test } from '@jest/globals';
import { innvilgelsesperiode, periode, søknadsbehandlingAvslag } from '~test/rammebehandling';
import {
    SøknadsbehandlingActions,
    SøknadsbehandlingAvslagState,
    SøknadsbehandlingIkkeValgtState,
    SøknadsbehandlingInnvilgelseState,
    søknadsbehandlingReducer,
} from '~/lib/rammebehandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';

const superType = BehandlingSkjemaType.Søknadsbehandling;

const ikkeValgtState: SøknadsbehandlingIkkeValgtState = {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
};

const avslagState: SøknadsbehandlingAvslagState = {
    resultat: SøknadsbehandlingResultat.AVSLAG,
    avslagsgrunner: [Avslagsgrunn.Alder],
    skalSendeVedtaksbrev: true,
};

const innvilgelseUtenPerioderState: SøknadsbehandlingInnvilgelseState = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: { harValgtPeriode: false, innvilgelsesperioder: [{ periode: {} }] },
};

const innvilgelseState: SøknadsbehandlingInnvilgelseState = {
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        skalSendeVedtaksbrev: true,
    },
};

const setSkalSendeVedtaksbrev = (skalSendeVedtaksbrev: boolean): SøknadsbehandlingActions => ({
    superType,
    type: 'setSkalSendeVedtaksbrev',
    payload: { skalSendeVedtaksbrev },
});

describe('søknadsbehandlingReducer', () => {
    describe('setResultat', () => {
        test('lager initial state for nytt resultat ut fra lagret behandling', () => {
            const behandling = søknadsbehandlingAvslag({
                avslagsgrunner: [Avslagsgrunn.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });

            const innvilgelse = søknadsbehandlingReducer(avslagState, {
                superType,
                type: 'setResultat',
                payload: { resultat: SøknadsbehandlingResultat.INNVILGELSE, behandling },
            });

            expect(innvilgelse).toEqual(innvilgelseUtenPerioderState);

            const tilbakeTilAvslag = søknadsbehandlingReducer(innvilgelse, {
                superType,
                type: 'setResultat',
                payload: { resultat: SøknadsbehandlingResultat.AVSLAG, behandling },
            });

            expect(tilbakeTilAvslag).toEqual({
                resultat: SøknadsbehandlingResultat.AVSLAG,
                avslagsgrunner: [Avslagsgrunn.FremmetForSent],
                skalSendeVedtaksbrev: false,
            });
        });
    });

    describe('setSkalSendeVedtaksbrev', () => {
        test('setter vedtaksbrev for avslag', () => {
            expect(søknadsbehandlingReducer(avslagState, setSkalSendeVedtaksbrev(false))).toEqual({
                ...avslagState,
                skalSendeVedtaksbrev: false,
            });
        });

        test('setter vedtaksbrev på innvilgelsen', () => {
            expect(
                søknadsbehandlingReducer(innvilgelseState, setSkalSendeVedtaksbrev(false)),
            ).toEqual({
                ...innvilgelseState,
                innvilgelse: { ...innvilgelseState.innvilgelse, skalSendeVedtaksbrev: false },
            });
        });

        test('kaster feil når resultat ikke er valgt', () => {
            expect(() =>
                søknadsbehandlingReducer(ikkeValgtState, setSkalSendeVedtaksbrev(false)),
            ).toThrow();
        });

        test('kaster feil når innvilgelsesperioden ikke er valgt', () => {
            expect(() =>
                søknadsbehandlingReducer(
                    innvilgelseUtenPerioderState,
                    setSkalSendeVedtaksbrev(false),
                ),
            ).toThrow();
        });
    });

    describe('oppdaterAvslagsgrunner', () => {
        const action: SøknadsbehandlingActions = {
            superType,
            type: 'oppdaterAvslagsgrunner',
            payload: { avslagsgrunner: [Avslagsgrunn.Livsoppholdytelser] },
        };

        test('setter avslagsgrunnene', () => {
            expect(søknadsbehandlingReducer(avslagState, action)).toEqual({
                ...avslagState,
                avslagsgrunner: [Avslagsgrunn.Livsoppholdytelser],
            });
        });

        test('kaster feil når resultatet ikke er avslag', () => {
            expect(() => søknadsbehandlingReducer(innvilgelseState, action)).toThrow();
        });
    });

    describe('innvilgelse-actions', () => {
        const action: SøknadsbehandlingActions = {
            superType,
            type: 'settAntallDager',
            payload: { antallDager: 8, index: 0 },
        };

        test('oppdaterer innvilgelsen', () => {
            const nyState = søknadsbehandlingReducer(innvilgelseState, action);

            expect(nyState).toMatchObject({
                innvilgelse: { innvilgelsesperioder: [{ antallDagerPerMeldeperiode: 8 }] },
            });
        });

        test.each([ikkeValgtState, avslagState])(
            'kaster feil når resultatet er $resultat',
            (state) => {
                expect(() => søknadsbehandlingReducer(state, action)).toThrow();
            },
        );
    });
});
