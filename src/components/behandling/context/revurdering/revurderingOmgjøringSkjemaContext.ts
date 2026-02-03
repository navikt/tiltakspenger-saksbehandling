import { RevurderingResultat } from '~/types/Revurdering';
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
import { BehandlingSkjemaType } from '~/components/behandling/context/behandlingSkjemaUtils';
import { Periode } from '~/types/Periode';

export type RevurderingOmgjøringState = {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelse: InnvilgelseState;
    vedtaksperiode: Periode;
};

type VedtaksperiodeActions = {
    type: 'oppdaterVedtaksperiode';
    payload: {
        periode: Partial<Periode>;
    };
};

type Actions = InnvilgelseActions | VedtaksperiodeActions;

export type RevurderingOmgjøringActions = ReducerSuperAction<
    Actions,
    BehandlingSkjemaType.RevurderingOmgjøring
>;

export const revurderingOmgjøringReducer: Reducer<
    RevurderingOmgjøringState,
    RevurderingOmgjøringActions
> = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'oppdaterVedtaksperiode':
            const nyVedtaksperiode = {
                ...state.vedtaksperiode,
                ...payload.periode,
            };

            return {
                ...state,
                vedtaksperiode: nyVedtaksperiode,
            };

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
            return {
                ...state,
                innvilgelse: innvilgelseReducer(state.innvilgelse, action),
            };
        }
    }

    throw Error(`Ugyldig action for omgjøring: ${type satisfies never}`);
};

export type RevurderingOmgjøringContext = BehandlingSkjemaContextBase<RevurderingOmgjøringState>;

export const useRevurderingOmgjøringSkjema = (): RevurderingOmgjøringContext => {
    const context = useBehandlingSkjema();

    if (context.resultat !== RevurderingResultat.OMGJØRING) {
        throw Error(`Feil resultat for revurdering omgjøring context: ${context.resultat}`);
    }

    return context;
};

export const useRevurderingOmgjøringSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();

    return (action: VedtaksperiodeActions) =>
        dispatch({ ...action, superType: BehandlingSkjemaType.RevurderingOmgjøring });
};
