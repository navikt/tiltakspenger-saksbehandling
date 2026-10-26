import { describe, expect, test } from '@jest/globals';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import {
    behandlingSkjemaFellesInitialState,
    behandlingSkjemaFellesReducer,
    BehandlingSkjemaFellesState,
} from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';

const superType = BehandlingSkjemaType.Felles;

const state: BehandlingSkjemaFellesState = {
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    erPrioritert: false,
    skalSendeVedtaksbrev: true,
};

describe('behandlingSkjemaFellesInitialState', () => {
    test('henter fellesfeltene fra behandlingen', () => {
        const behandling = søknadsbehandlingIkkeValgt({
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
            prioritering: { begrunnelse: ikkeSladdet('Haster') },
            skalSendeVedtaksbrev: false,
        });

        expect(behandlingSkjemaFellesInitialState(behandling)).toEqual({
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
            erPrioritert: true,
            skalSendeVedtaksbrev: false,
        });
    });

    test('er ikke prioritert når behandlingen mangler prioritering', () => {
        const behandling = søknadsbehandlingIkkeValgt({ prioritering: null });

        expect(behandlingSkjemaFellesInitialState(behandling).erPrioritert).toBe(false);
    });
});

describe('behandlingSkjemaFellesReducer', () => {
    test('setSkalJournalføreNotatVilkårsvurdering endrer kun vilkårsvurdering', () => {
        const nyState = behandlingSkjemaFellesReducer(
            { ...state, skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: true } },
            {
                superType,
                type: 'setSkalJournalføreNotatVilkårsvurdering',
                payload: { skalJournalføreNotat: true },
            },
        );

        expect(nyState.skalJournalføreNotat).toEqual({
            vilkårsvurdering: true,
            barnetillegg: true,
        });
    });

    test('setSkalJournalføreNotatBarnetillegg endrer kun barnetillegg', () => {
        const nyState = behandlingSkjemaFellesReducer(
            { ...state, skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false } },
            {
                superType,
                type: 'setSkalJournalføreNotatBarnetillegg',
                payload: { skalJournalføreNotat: true },
            },
        );

        expect(nyState.skalJournalføreNotat).toEqual({
            vilkårsvurdering: true,
            barnetillegg: true,
        });
    });

    test('setErPrioritert endrer prioriteringen', () => {
        const nyState = behandlingSkjemaFellesReducer(state, {
            superType,
            type: 'setErPrioritert',
            payload: { erPrioritert: true },
        });

        expect(nyState).toEqual({ ...state, erPrioritert: true });
    });

    test('setSkalSendeVedtaksbrev endrer vedtaksbrev-valget', () => {
        const nyState = behandlingSkjemaFellesReducer(state, {
            superType,
            type: 'setSkalSendeVedtaksbrev',
            payload: { skalSendeVedtaksbrev: false },
        });

        expect(nyState).toEqual({ ...state, skalSendeVedtaksbrev: false });
    });
});
