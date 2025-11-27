import { RammebehandlingResultatMedInnvilgelse } from '~/types/Rammebehandling';
import { Periode } from '~/types/Periode';
import {
    TiltaksdeltagelseActions,
    tiltaksdeltagelseReducer,
} from '~/components/behandling/context/innvilgelse/slices/tiltaksdeltagelseContext';
import {
    AntallDagerPerMeldeperiodeActions,
    antallDagerPerMeldeperiodeReducer,
} from '~/components/behandling/context/innvilgelse/slices/antallDagerPerMeldeperiodeContext';
import {
    InnvilgelsesperiodeAction,
    innvilgelsesperiodeReducer,
} from '~/components/behandling/context/innvilgelse/slices/innvilgelsesperiodeContext';
import {
    BarnetilleggActions,
    barnetilleggReducer,
} from '~/components/behandling/context/innvilgelse/slices/barnetilleggContext';
import { Reducer } from 'react';
import {
    BehandlingSkjemaMedFritekst,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    BehandlingSkjemaType,
    erRammebehandlingInnvilgelseContext,
    erRammebehandlingInnvilgelseMedPerioderContext,
    innvilgelseDefaultState,
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { AntallDagerPerMeldeperiode } from '~/types/AntallDagerPerMeldeperiode';
import { erFullstendigPeriode } from '~/utils/periode';

export type BehandlingInnvilgelseSteg1State = {
    harValgtPeriode: false;
    innvilgelsesperiode: Partial<Periode>;
};

export type BehandlingInnvilgelseSteg2State = {
    harValgtPeriode: true;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    harBarnetillegg: boolean;
    barnetilleggPerioder: BarnetilleggPeriode[];
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiode[];
};

export type BehandlingInnvilgelseState =
    | BehandlingInnvilgelseSteg1State
    | BehandlingInnvilgelseSteg2State;

export type BehandlingMedInnvilgelseState = {
    resultat: RammebehandlingResultatMedInnvilgelse;
    innvilgelse: BehandlingInnvilgelseState;
};

export type BehandlingMedInnvilgelseSteg2State = {
    resultat: RammebehandlingResultatMedInnvilgelse;
    innvilgelse: BehandlingInnvilgelseSteg2State;
};

export type BehandlingInnvilgelseActions =
    | InnvilgelsesperiodeAction
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | AntallDagerPerMeldeperiodeActions;

export const behandlingInnvilgelseReducer: Reducer<
    BehandlingInnvilgelseState,
    BehandlingInnvilgelseActions
> = (state, action) => {
    const { type } = action;
    const { harValgtPeriode } = state;

    if (!harValgtPeriode) {
        if (type !== 'oppdaterInnvilgelsesperiode') {
            throw Error(
                'Kan ikke endre andre deler av behandlingen før innvilgelsesperioden er valgt',
            );
        }

        const { periode, behandling } = action.payload;

        const innvilgelsesperiode = { ...state.innvilgelsesperiode, ...periode };

        if (erFullstendigPeriode(innvilgelsesperiode)) {
            return innvilgelseDefaultState(behandling, innvilgelsesperiode);
        }

        return {
            ...state,
            innvilgelsesperiode,
        };
    }

    switch (type) {
        case 'oppdaterInnvilgelsesperiode': {
            return innvilgelsesperiodeReducer(state, action);
        }

        case 'leggTilAntallDagerPeriode':
        case 'fjernAntallDagerPeriode':
        case 'oppdaterAntallDagerFraOgMed':
        case 'oppdaterAntallDagerTilOgMed':
        case 'settAntallDagerForPeriode': {
            return antallDagerPerMeldeperiodeReducer(state, action);
        }

        case 'setHarSøktBarnetillegg':
        case 'addBarnetilleggPeriode':
        case 'fjernBarnetilleggPeriode':
        case 'oppdaterBarnetilleggAntall':
        case 'oppdaterBarnetilleggFraOgMed':
        case 'oppdaterBarnetilleggTilOgMed':
        case 'nullstillBarnetilleggPerioder': {
            return barnetilleggReducer(state, action);
        }

        case 'addTiltakPeriode':
        case 'fjernTiltakPeriode':
        case 'oppdaterTiltakId':
        case 'oppdaterTiltaksdeltagelseFraOgMed':
        case 'oppdaterTiltaksdeltagelseTilOgMed': {
            return tiltaksdeltagelseReducer(state, action);
        }
    }

    throw Error(`Ugyldig action for behandling innvilgelse skjema: "${type satisfies never}"`);
};

export type BehandlingMedInnvilgelseContext =
    BehandlingSkjemaMedFritekst<BehandlingMedInnvilgelseState>;

export const useBehandlingInnvilgelseSkjema = (): BehandlingMedInnvilgelseContext => {
    const context = useBehandlingSkjema();

    if (!erRammebehandlingInnvilgelseContext(context)) {
        throw Error(
            `Feil resultat for innvilgelse context: ${context.resultat} - ${JSON.stringify(context)}`,
        );
    }

    return context;
};

export type BehandlingMedInnvilgelseSteg2Context =
    BehandlingSkjemaMedFritekst<BehandlingMedInnvilgelseSteg2State>;

export const useBehandlingInnvilgelseSteg2Skjema = (): BehandlingMedInnvilgelseSteg2Context => {
    const context = useBehandlingSkjema();

    if (!erRammebehandlingInnvilgelseMedPerioderContext(context)) {
        throw Error(`Feil resultat for innvilgelse context: ${context.resultat}`);
    }

    return context;
};

export const useBehandlingInnvilgelseSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();
    const { resultat } = useBehandlingInnvilgelseSkjema();

    return (action: BehandlingInnvilgelseActions) =>
        dispatch({
            ...action,
            superType: reducerSuperType[resultat],
        });
};

const reducerSuperType = {
    [SøknadsbehandlingResultat.INNVILGELSE]: BehandlingSkjemaType.Søknadsbehandling,
    [RevurderingResultat.INNVILGELSE]: BehandlingSkjemaType.RevurderingInnvilgelse,
    [RevurderingResultat.OMGJØRING]: BehandlingSkjemaType.RevurderingOmgjøring,
} as const satisfies Record<RammebehandlingResultatMedInnvilgelse, BehandlingSkjemaType>;
