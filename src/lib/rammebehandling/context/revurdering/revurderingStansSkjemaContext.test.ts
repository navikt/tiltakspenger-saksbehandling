import { describe, expect, test } from '@jest/globals';
import {
    revurderingStansReducer,
    RevurderingStansState,
} from '~/lib/rammebehandling/context/revurdering/revurderingStansSkjemaContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { HjemmelForStans, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

const superType = BehandlingSkjemaType.RevurderingStans;

const state: RevurderingStansState = {
    resultat: RevurderingResultat.STANS,
    fraDato: undefined,
    hjemlerForStans: [],
    harValgtStansFraFørsteDagSomGirRett: false,
};

describe('revurderingStansReducer', () => {
    test('setStansFraDato setter fra-datoen', () => {
        expect(
            revurderingStansReducer(state, {
                superType,
                type: 'setStansFraDato',
                payload: { fraDato: '2025-03-01' },
            }),
        ).toEqual({ ...state, fraDato: '2025-03-01' });
    });

    test('setHjemlerForStans setter hjemlene', () => {
        expect(
            revurderingStansReducer(state, {
                superType,
                type: 'setHjemlerForStans',
                payload: { hjemler: [HjemmelForStans.Alder, HjemmelForStans.LønnFraAndre] },
            }),
        ).toEqual({
            ...state,
            hjemlerForStans: [HjemmelForStans.Alder, HjemmelForStans.LønnFraAndre],
        });
    });

    test('setHarValgtFørsteDagSomGirRett setter valget', () => {
        expect(
            revurderingStansReducer(state, {
                superType,
                type: 'setHarValgtFørsteDagSomGirRett',
                payload: { harValgtFørsteDagSomGirRett: true },
            }),
        ).toEqual({ ...state, harValgtStansFraFørsteDagSomGirRett: true });
    });

    test('setHarValgtFørsteDagSomGirRett beholder valget når det mangler i payload', () => {
        const valgtState = { ...state, harValgtStansFraFørsteDagSomGirRett: true };

        expect(
            revurderingStansReducer(valgtState, {
                superType,
                type: 'setHarValgtFørsteDagSomGirRett',
                payload: {},
            }),
        ).toEqual(valgtState);
    });
});
