import { describe, expect, test } from '@jest/globals';
import {
    behandlingSkjemaReducer,
    BehandlingSkjemaState,
} from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import {
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';

const ikkeValgtState: BehandlingSkjemaState = {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    erPrioritert: false,
};

describe('behandlingSkjemaReducer', () => {
    test('setter fellesfeltene uten å endre resultatet', () => {
        const prioritert = behandlingSkjemaReducer(ikkeValgtState, {
            superType: BehandlingSkjemaType.Felles,
            type: 'setErPrioritert',
            payload: { erPrioritert: true },
        });

        const journalført = behandlingSkjemaReducer(prioritert, {
            superType: BehandlingSkjemaType.Felles,
            type: 'setSkalJournalføreNotatVilkårsvurdering',
            payload: { skalJournalføreNotat: true },
        });

        expect(journalført).toEqual({
            resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
            erPrioritert: true,
        });
    });

    test('beholder fellesfeltene når resultatet endres', () => {
        const state: BehandlingSkjemaState = {
            ...ikkeValgtState,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: true },
            erPrioritert: true,
        };

        const behandling = {
            resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            skalSendeVedtaksbrev: true,
        } as Søknadsbehandling;

        const nyState = behandlingSkjemaReducer(state, {
            superType: BehandlingSkjemaType.Søknadsbehandling,
            type: 'setResultat',
            payload: { resultat: SøknadsbehandlingResultat.AVSLAG, behandling },
        });

        expect(nyState).toEqual({
            resultat: SøknadsbehandlingResultat.AVSLAG,
            avslagsgrunner: [],
            skalSendeVedtaksbrev: true,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: true },
            erPrioritert: true,
        });
    });
});
