import { describe, expect, test } from '@jest/globals';
import { innvilgelsesperiode, omgjøringOpphør, periode, sak } from '~test/rammebehandling';
import {
    OmgjøringActions,
    OmgjøringIkkeValgtState,
    OmgjøringInnvilgelseState,
    OmgjøringOpphørState,
    omgjøringReducer,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { HjemmelForOpphør, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

const superType = BehandlingSkjemaType.RevurderingOmgjøring;

const ikkeValgtState: OmgjøringIkkeValgtState = {
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
};

const opphørState: OmgjøringOpphørState = {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
    vedtaksperiode: periode('2025-01-01', '2025-03-31'),
    valgteHjemler: [],
};

const innvilgelseUtenPerioderState: OmgjøringInnvilgelseState = {
    resultat: RevurderingResultat.OMGJØRING,
    vedtaksperiode: {},
    innvilgelse: { harValgtPeriode: false, innvilgelsesperioder: [{ periode: {} }] },
};

const innvilgelseState: OmgjøringInnvilgelseState = {
    resultat: RevurderingResultat.OMGJØRING,
    vedtaksperiode: periode('2025-01-01', '2025-03-31'),
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
        harBarnetillegg: false,
        barnetilleggPerioder: [],
    },
};

const oppdaterVedtaksperiode = (
    periodeOppdatering: Partial<{ fraOgMed: string; tilOgMed: string }>,
): OmgjøringActions => ({
    superType,
    type: 'oppdaterVedtaksperiode',
    payload: { periodeOppdatering },
});

describe('omgjøringReducer', () => {
    test('setResultat lager initial state for nytt resultat ut fra lagret behandling', () => {
        const behandling = omgjøringOpphør({
            vedtaksperiode: periode('2025-02-01', '2025-02-28'),
            valgteHjemler: [HjemmelForOpphør.Alder],
        });

        const nullstilt = omgjøringReducer(opphørState, {
            superType,
            type: 'setResultat',
            payload: { resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT, behandling, sak: sak() },
        });

        expect(nullstilt).toEqual(ikkeValgtState);

        const tilbakeTilOpphør = omgjøringReducer(nullstilt, {
            superType,
            type: 'setResultat',
            payload: { resultat: RevurderingResultat.OMGJØRING_OPPHØR, behandling, sak: sak() },
        });

        expect(tilbakeTilOpphør).toEqual({
            resultat: RevurderingResultat.OMGJØRING_OPPHØR,
            vedtaksperiode: periode('2025-02-01', '2025-02-28'),
            valgteHjemler: [HjemmelForOpphør.Alder],
        });
    });

    describe('oppdaterVedtaksperiode', () => {
        test('fyller ut en tom vedtaksperiode gradvis', () => {
            const medFraOgMed = omgjøringReducer(
                innvilgelseUtenPerioderState,
                oppdaterVedtaksperiode({ fraOgMed: '2025-02-01' }),
            );

            expect(medFraOgMed).toMatchObject({ vedtaksperiode: { fraOgMed: '2025-02-01' } });

            const medTilOgMed = omgjøringReducer(
                medFraOgMed,
                oppdaterVedtaksperiode({ tilOgMed: '2025-04-30' }),
            );

            expect(medTilOgMed).toEqual({
                ...innvilgelseUtenPerioderState,
                vedtaksperiode: periode('2025-02-01', '2025-04-30'),
            });
        });

        test('oppdaterer vedtaksperioden for opphør', () => {
            expect(
                omgjøringReducer(opphørState, oppdaterVedtaksperiode({ tilOgMed: '2025-02-28' })),
            ).toEqual({ ...opphørState, vedtaksperiode: periode('2025-01-01', '2025-02-28') });
        });

        test('kaster feil når resultat ikke er valgt', () => {
            expect(() =>
                omgjøringReducer(
                    ikkeValgtState,
                    oppdaterVedtaksperiode({ fraOgMed: '2025-01-01' }),
                ),
            ).toThrow();
        });
    });

    describe('setHjemlerForOpphør', () => {
        const action: OmgjøringActions = {
            superType,
            type: 'setHjemlerForOpphør',
            payload: { hjemler: [HjemmelForOpphør.Institusjonsopphold] },
        };

        test('setter hjemlene for opphør', () => {
            expect(omgjøringReducer(opphørState, action)).toEqual({
                ...opphørState,
                valgteHjemler: [HjemmelForOpphør.Institusjonsopphold],
            });
        });

        test.each([ikkeValgtState, innvilgelseState])(
            'kaster feil når resultatet er $resultat',
            (state) => {
                expect(() => omgjøringReducer(state, action)).toThrow();
            },
        );
    });

    describe('innvilgelse-actions', () => {
        const action: OmgjøringActions = {
            superType,
            type: 'settTiltaksdeltakelse',
            payload: { internDeltakelseId: 'deltakelse_2', index: 0 },
        };

        test('oppdaterer innvilgelsen', () => {
            expect(omgjøringReducer(innvilgelseState, action)).toMatchObject({
                innvilgelse: { innvilgelsesperioder: [{ internDeltakelseId: 'deltakelse_2' }] },
            });
        });

        test.each([ikkeValgtState, opphørState])(
            'kaster feil når resultatet er $resultat',
            (state) => {
                expect(() => omgjøringReducer(state, action)).toThrow();
            },
        );
    });
});
