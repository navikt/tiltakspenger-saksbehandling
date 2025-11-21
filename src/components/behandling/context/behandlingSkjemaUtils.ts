import {
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
} from '~/utils/behandling';
import { BehandlingInnvilgelseState } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { SøknadsbehandlingState } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { BehandlingSkjemaState } from '~/components/behandling/context/behandlingSkjemaReducer';

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaState,
): context is BehandlingInnvilgelseState => {
    return erRammebehandlingInnvilgelseResultat(context.resultat);
};

export const erSøknadsbehandlingContext = (
    context: BehandlingSkjemaState,
): context is SøknadsbehandlingState => {
    return erSøknadsbehandlingResultat(context.resultat);
};

export enum BehandlingSkjemaActionSuperType {
    Søknadsbehandling = 'Søknadsbehandling',
    RevurderingInnvilgelse = 'RevurderingInnvilgelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}
