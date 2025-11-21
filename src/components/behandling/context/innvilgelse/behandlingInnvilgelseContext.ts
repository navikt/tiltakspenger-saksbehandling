import { RammebehandlingResultatMedInnvilgelse } from '~/types/Rammebehandling';
import { Periode } from '~/types/Periode';
import {
    TiltaksdeltagelseActions,
    tiltaksdeltagelseReducer,
    TiltaksdeltakelsePeriodeFormData,
} from '~/components/behandling/context/innvilgelse/slices/tiltaksdeltagelseContext';
import {
    AntallDagerPerMeldeperiodeActions,
    AntallDagerPerMeldeperiodeFormData,
    antallDagerPerMeldeperiodeReducer,
} from '~/components/behandling/context/innvilgelse/slices/antallDagerPerMeldeperiodeContext';
import { BarnetilleggPeriodeFormData } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraBehandling';
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
} from '~/components/behandling/context/behandlingSkjemaUtils';

// Gjenbrukes ved alle behandlingsresultater som gir innvilgelse
export type BehandlingInnvilgelseState = {
    resultat: RammebehandlingResultatMedInnvilgelse;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriodeFormData[];
    harBarnetillegg: boolean;
    barnetilleggPerioder: BarnetilleggPeriodeFormData[];
    antallDagerPerMeldeperiode: AntallDagerPerMeldeperiodeFormData[];
};

export type BehandlingInnvilgelseActions =
    | InnvilgelsesperiodeAction
    | TiltaksdeltagelseActions
    | BarnetilleggActions
    | AntallDagerPerMeldeperiodeActions;

export const behandlingInnvilgelseReducer = (<State extends BehandlingInnvilgelseState>(
    state: State,
    action: BehandlingInnvilgelseActions,
): State => {
    const { type } = action;

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
}) satisfies Reducer<BehandlingInnvilgelseState, BehandlingInnvilgelseActions>;

export type BehandlingInnvilgelseContext = BehandlingSkjemaMedFritekst<BehandlingInnvilgelseState>;

export const useBehandlingInnvilgelseSkjema = (): BehandlingInnvilgelseContext => {
    const context = useBehandlingSkjema();

    if (!erRammebehandlingInnvilgelseContext(context)) {
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
