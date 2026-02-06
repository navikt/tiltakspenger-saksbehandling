import { Omgjøring, OmgjøringResultat, RevurderingResultat } from '~/types/Revurdering';
import { Reducer } from 'react';
import { ReducerSuperAction } from '~/types/Context';
import {
    InnvilgelseActions,
    innvilgelseReducer,
    InnvilgelseState,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import {
    BehandlingSkjemaContextBase,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import {
    BehandlingSkjemaType,
    erOmgjøringContext,
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { Periode } from '~/types/Periode';
import { omgjøringInitialState } from '~/components/behandling/context/revurdering/revurderingInitialState';
import { SakProps } from '~/types/Sak';

export type OmgjøringIkkeValgtState = {
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT;
};

export type OmgjøringOpphørState = {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
};

export type OmgjøringInnvilgelseState = {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelse: InnvilgelseState;
    vedtaksperiode: Periode;
};

export type OmgjøringState =
    | OmgjøringIkkeValgtState
    | OmgjøringOpphørState
    | OmgjøringInnvilgelseState;

type OmgjøringSetResultatAction = {
    type: 'setResultat';
    payload: {
        resultat: OmgjøringResultat;
        behandling: Omgjøring;
        sak: SakProps;
    };
};

type VedtaksperiodeAction = {
    type: 'oppdaterVedtaksperiode';
    payload: {
        periode: Partial<Periode>;
    };
};

type Actions = InnvilgelseActions | VedtaksperiodeAction | OmgjøringSetResultatAction;

export type OmgjøringActions = ReducerSuperAction<
    Actions,
    BehandlingSkjemaType.RevurderingOmgjøring
>;

export const omgjøringReducer: Reducer<OmgjøringState, OmgjøringActions> = (state, action) => {
    const { resultat } = state;
    const { type, payload } = action;

    switch (type) {
        case 'setResultat': {
            const { resultat: nyttResultat, behandling, sak } = payload;
            return omgjøringInitialState(behandling, sak, nyttResultat);
        }

        case 'oppdaterVedtaksperiode': {
            if (resultat === RevurderingResultat.OMGJØRING_IKKE_VALGT) {
                throw Error('Kan ikke sette vedtaksperiode før omgjøringstype er valgt');
            }

            const nyVedtaksperiode = {
                ...state.vedtaksperiode,
                ...payload.periode,
            };

            return {
                ...state,
                vedtaksperiode: nyVedtaksperiode,
            };
        }

        case 'oppdaterInnvilgelsesperiode':
        case 'fjernInnvilgelsesperiode':
        case 'leggTilInnvilgelsesperiode':
        case 'settTiltaksdeltakelse':
        case 'settAntallDager':
        case 'setHarSøktBarnetillegg':
        case 'addBarnetilleggPeriode':
        case 'fjernBarnetilleggPeriode':
        case 'oppdaterBarnetilleggAntall':
        case 'oppdaterBarnetilleggPeriode':
        case 'settBarnetilleggPerioder': {
            if (resultat !== RevurderingResultat.OMGJØRING) {
                throw Error(
                    `Behandlingen må være en omgjøring innvilgelse for action type ${type}`,
                );
            }

            return {
                ...state,
                innvilgelse: innvilgelseReducer(state.innvilgelse, action),
            };
        }
    }

    throw Error(`Ugyldig action for omgjøring: ${type satisfies never}`);
};

export type OmgjøringContext = BehandlingSkjemaContextBase<OmgjøringState>;
export type OmgjøringMedValgtResultatContext = BehandlingSkjemaContextBase<
    OmgjøringInnvilgelseState | OmgjøringOpphørState
>;

export const useOmgjøringSkjema = (): OmgjøringContext => {
    const context = useBehandlingSkjema();

    if (!erOmgjøringContext(context)) {
        throw Error(`Feil resultat for omgjøring context: ${context.resultat}`);
    }

    return context;
};

export const useOmgjøringMedValgtResultatSkjema = (): OmgjøringMedValgtResultatContext => {
    const context = useOmgjøringSkjema();

    if (context.resultat === RevurderingResultat.OMGJØRING_IKKE_VALGT) {
        throw Error(
            'Resultat for omgjøring er ikke valgt, og kan derfor ikke brukes i komponenter som krever valgt resultat',
        );
    }

    return context;
};

export const useOmgjøringSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: Actions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingOmgjøring });
};
