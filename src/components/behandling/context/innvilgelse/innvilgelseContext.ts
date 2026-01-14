import { RammebehandlingResultatMedInnvilgelse } from '~/types/Rammebehandling';
import {
    InnvilgelsesperioderActions,
    innvilgelsesperioderReducer,
} from '~/components/behandling/context/innvilgelse/slices/innvilgelsesperiodeContext';
import {
    BarnetilleggActions,
    barnetilleggReducer,
} from '~/components/behandling/context/innvilgelse/slices/barnetilleggContext';
import { Reducer } from 'react';
import {
    BehandlingSkjemaContextBase,
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';
import {
    BehandlingSkjemaType,
    erRammebehandlingInnvilgelseContext,
    erRammebehandlingInnvilgelseMedPerioderContext,
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { Innvilgelsesperiode, InnvilgelsesperiodePartial } from '~/types/Innvilgelsesperiode';

export type InnvilgelseUtenPerioderState = {
    harValgtPeriode: false;
    innvilgelsesperioder: [InnvilgelsesperiodePartial];
};

export type InnvilgelseMedPerioderState = {
    harValgtPeriode: true;
    innvilgelsesperioder: Innvilgelsesperiode[];
    harBarnetillegg: boolean;
    barnetilleggPerioder: BarnetilleggPeriode[];
};

export type InnvilgelseState = InnvilgelseUtenPerioderState | InnvilgelseMedPerioderState;

export type BehandlingInnvilgelseState = {
    resultat: RammebehandlingResultatMedInnvilgelse;
    innvilgelse: InnvilgelseState;
};

export type BehandlingInnvilgelseMedPerioderState = {
    resultat: RammebehandlingResultatMedInnvilgelse;
    innvilgelse: InnvilgelseMedPerioderState;
};

export type InnvilgelseActions = InnvilgelsesperioderActions | BarnetilleggActions;

export const innvilgelseReducer: Reducer<InnvilgelseState, InnvilgelseActions> = (
    state,
    action,
) => {
    const { type } = action;
    const { harValgtPeriode } = state;

    switch (type) {
        case 'oppdaterInnvilgelsesperiode':
        case 'leggTilInnvilgelsesperiode':
        case 'fjernInnvilgelsesperiode':
        case 'settAntallDager':
        case 'settTiltaksdeltakelse': {
            return innvilgelsesperioderReducer(state, action);
        }
    }

    if (!harValgtPeriode) {
        throw Error('Kan ikke endre andre deler av innvilgelsen før innvilgelsesperioden er valgt');
    }

    switch (type) {
        case 'setHarSøktBarnetillegg':
        case 'addBarnetilleggPeriode':
        case 'fjernBarnetilleggPeriode':
        case 'oppdaterBarnetilleggAntall':
        case 'oppdaterBarnetilleggPeriode':
        case 'settBarnetilleggPerioder': {
            return barnetilleggReducer(state, action);
        }
    }

    throw Error(`Ugyldig action for behandling innvilgelse skjema: "${type satisfies never}"`);
};

export type BehandlingInnvilgelseContext = BehandlingSkjemaContextBase<BehandlingInnvilgelseState>;

export const useBehandlingInnvilgelseSkjema = (): BehandlingInnvilgelseContext => {
    const context = useBehandlingSkjema();

    if (!erRammebehandlingInnvilgelseContext(context)) {
        throw Error(
            `Feil resultat for innvilgelse context: ${context.resultat} - ${JSON.stringify(context)}`,
        );
    }

    return context;
};

export type BehandlingInnvilgelseMedPerioderContext =
    BehandlingSkjemaContextBase<BehandlingInnvilgelseMedPerioderState>;

export const useBehandlingInnvilgelseMedPerioderSkjema =
    (): BehandlingInnvilgelseMedPerioderContext => {
        const context = useBehandlingSkjema();

        if (!erRammebehandlingInnvilgelseMedPerioderContext(context)) {
            throw Error(`Feil context for innvilgelse med perioder: ${JSON.stringify(context)}`);
        }

        return context;
    };

export const useBehandlingInnvilgelseSkjemaDispatch = () => {
    const dispatch = useBehandlingSkjemaDispatch();
    const { resultat } = useBehandlingInnvilgelseSkjema();

    return (action: InnvilgelseActions) =>
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
