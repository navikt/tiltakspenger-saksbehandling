import { describe, expect, test } from '@jest/globals';
import { meldekortbehandlingSkjemaReducer } from '~/lib/meldekort/meldekortbehandling/context/meldekortbehandlingSkjemaReducer';
import { MeldekortbehandlingSkjemaState } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';

const state: MeldekortbehandlingSkjemaState = {
    meldeperioder: [],
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: false,
    erPrioritert: false,
};

describe('meldekortbehandlingSkjemaReducer', () => {
    test('setErPrioritert endrer kun prioriteringen', () => {
        const prioritert = meldekortbehandlingSkjemaReducer(state, {
            type: 'setErPrioritert',
            payload: { erPrioritert: true },
        });

        expect(prioritert).toEqual({ ...state, erPrioritert: true });
        expect(
            meldekortbehandlingSkjemaReducer(prioritert, {
                type: 'setErPrioritert',
                payload: { erPrioritert: false },
            }),
        ).toEqual(state);
    });
});
