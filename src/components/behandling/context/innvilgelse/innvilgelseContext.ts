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
} from '~/components/behandling/context/behandlingSkjemaUtils';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';
import { BarnetilleggPeriode } from '~/types/Barnetillegg';
import { AntallDagerPerMeldeperiode } from '~/types/AntallDagerPerMeldeperiode';

export type InnvilgelseUtenPerioderState = {
    harValgtPeriode: false;
    innvilgelsesperiode: Partial<Periode>;
};

export type InnvilgelseMedPerioderState = {
    harValgtPeriode: true;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    harBarnetillegg: boolean;
    barnetilleggPerioder: BarnetilleggPeriode[];
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiode[];
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

export type InnvilgelseActions =
    | InnvilgelsesperiodeAction
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | AntallDagerPerMeldeperiodeActions;

export const innvilgelseReducer: Reducer<InnvilgelseState, InnvilgelseActions> = (
    state,
    action,
) => {
    const { type } = action;
    const { harValgtPeriode } = state;

    if (type === 'oppdaterInnvilgelsesperiode') {
        return innvilgelsesperiodeReducer(state, action);
    }

    if (!harValgtPeriode) {
        throw Error('Kan ikke endre andre deler av innvilgelsen før innvilgelsesperioden er valgt');
    }

    switch (type) {
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
        case 'settBarnetilleggPerioder': {
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

export type BehandlingInnvilgelseContext = BehandlingSkjemaMedFritekst<BehandlingInnvilgelseState>;

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
    BehandlingSkjemaMedFritekst<BehandlingInnvilgelseMedPerioderState>;

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
