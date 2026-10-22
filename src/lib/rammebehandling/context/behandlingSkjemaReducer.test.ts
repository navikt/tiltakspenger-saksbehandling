import { describe, expect, test } from '@jest/globals';
import {
    innvilgelsesperiode,
    omgjøringIkkeValgt,
    periode,
    revurderingStans,
    sak,
    søknadsbehandlingAvslag,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    BehandlingSkjemaActions,
    behandlingSkjemaReducer,
    BehandlingSkjemaState,
} from '~/lib/rammebehandling/context/behandlingSkjemaReducer';
import { BehandlingSkjemaType } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { behandlingSkjemaInitialState } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import {
    Avslagsgrunn,
    Søknadsbehandling,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { HjemmelForStans, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

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

const fellesState = {
    skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
    erPrioritert: true,
};

const stansState: BehandlingSkjemaState = {
    ...fellesState,
    resultat: RevurderingResultat.STANS,
    fraDato: undefined,
    hjemlerForStans: [],
    harValgtStansFraFørsteDagSomGirRett: false,
    skalSendeVedtaksbrev: true,
};

const revurderingInnvilgelseState: BehandlingSkjemaState = {
    ...fellesState,
    resultat: RevurderingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        skalSendeVedtaksbrev: true,
    },
};

const omgjøringIkkeValgtState: BehandlingSkjemaState = {
    ...fellesState,
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
};

describe('behandlingSkjemaReducer for revurderinger', () => {
    test('sender stans-actions videre og beholder fellesfeltene', () => {
        expect(
            behandlingSkjemaReducer(stansState, {
                superType: BehandlingSkjemaType.RevurderingStans,
                type: 'setHjemlerForStans',
                payload: { hjemler: [HjemmelForStans.Alder] },
            }),
        ).toEqual({ ...stansState, hjemlerForStans: [HjemmelForStans.Alder] });
    });

    test('sender revurdering innvilgelse-actions videre og beholder fellesfeltene', () => {
        expect(
            behandlingSkjemaReducer(revurderingInnvilgelseState, {
                superType: BehandlingSkjemaType.RevurderingInnvilgelse,
                type: 'setSkalSendeVedtaksbrev',
                payload: { skalSendeVedtaksbrev: false },
            }),
        ).toMatchObject({
            ...fellesState,
            innvilgelse: { skalSendeVedtaksbrev: false },
        });
    });

    test('beholder fellesfeltene når omgjøringsresultatet endres', () => {
        expect(
            behandlingSkjemaReducer(omgjøringIkkeValgtState, {
                superType: BehandlingSkjemaType.RevurderingOmgjøring,
                type: 'setResultat',
                payload: {
                    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                    behandling: omgjøringIkkeValgt(),
                    sak: sak(),
                },
            }),
        ).toEqual({
            ...fellesState,
            resultat: RevurderingResultat.OMGJØRING_OPPHØR,
            vedtaksperiode: {},
            valgteHjemler: [],
            skalSendeVedtaksbrev: true,
        });
    });
});

describe('behandlingSkjemaReducer med action for feil resultat', () => {
    const søknadsbehandlingAction: BehandlingSkjemaActions = {
        superType: BehandlingSkjemaType.Søknadsbehandling,
        type: 'oppdaterAvslagsgrunner',
        payload: { avslagsgrunner: [] },
    };

    const revurderingInnvilgelseAction: BehandlingSkjemaActions = {
        superType: BehandlingSkjemaType.RevurderingInnvilgelse,
        type: 'settAntallDager',
        payload: { antallDager: 6, index: 0 },
    };

    const omgjøringAction: BehandlingSkjemaActions = {
        superType: BehandlingSkjemaType.RevurderingOmgjøring,
        type: 'oppdaterVedtaksperiode',
        payload: { periodeOppdatering: { fraOgMed: '2025-01-01' } },
    };

    const stansAction: BehandlingSkjemaActions = {
        superType: BehandlingSkjemaType.RevurderingStans,
        type: 'setStansFraDato',
        payload: { fraDato: '2025-01-01' },
    };

    test.each([
        { state: stansState, action: søknadsbehandlingAction },
        { state: stansState, action: revurderingInnvilgelseAction },
        { state: stansState, action: omgjøringAction },
        { state: revurderingInnvilgelseState, action: stansAction },
        { state: ikkeValgtState, action: omgjøringAction },
    ])(
        'kaster feil for $action.superType-action når resultatet er $state.resultat',
        ({ state, action }) => {
            expect(() => behandlingSkjemaReducer(state, action)).toThrow();
        },
    );
});

describe('behandlingSkjemaInitialState', () => {
    test('slår sammen initial state for søknadsbehandlingen med fellesfeltene', () => {
        const behandling = søknadsbehandlingAvslag({
            avslagsgrunner: [Avslagsgrunn.Alder],
            skalSendeVedtaksbrev: false,
            skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
            prioritering: { begrunnelse: ikkeSladdet('Haster') },
        });

        expect(behandlingSkjemaInitialState({ behandling, sak: sak() })).toEqual({
            resultat: SøknadsbehandlingResultat.AVSLAG,
            avslagsgrunner: [Avslagsgrunn.Alder],
            skalSendeVedtaksbrev: false,
            ...fellesState,
        });
    });

    test('slår sammen initial state for revurderingen med fellesfeltene', () => {
        const behandling = revurderingStans({
            vedtaksperiode: periode('2025-03-01', '2025-06-30'),
            valgtHjemmelHarIkkeRettighet: [HjemmelForStans.Alder],
        });

        expect(behandlingSkjemaInitialState({ behandling, sak: sak() })).toEqual({
            resultat: RevurderingResultat.STANS,
            fraDato: '2025-03-01',
            hjemlerForStans: [HjemmelForStans.Alder],
            harValgtStansFraFørsteDagSomGirRett: false,
            skalSendeVedtaksbrev: true,
            skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
            erPrioritert: false,
        });
    });
});
