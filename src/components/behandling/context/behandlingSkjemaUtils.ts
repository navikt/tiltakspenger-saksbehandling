import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';
import {
    erRammebehandlingInnvilgelseResultat,
    erSøknadsbehandlingResultat,
} from '~/utils/behandling';
import { BehandlingInnvilgelseContext } from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { SøknadsbehandlingSkjemaContext } from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

export const erRammebehandlingInnvilgelseContext = (
    context: BehandlingSkjemaContext,
): context is BehandlingInnvilgelseContext => {
    const { resultat } = context;

    return erRammebehandlingInnvilgelseResultat(resultat);
};

export const erSøknadsbehandlingContext = (
    context: BehandlingSkjemaContext,
): context is SøknadsbehandlingSkjemaContext => {
    const { resultat } = context;

    return erSøknadsbehandlingResultat(resultat);
};

export enum BehandlingSkjemaActionSuperType {
    Søknadsbehandling = 'Søknadsbehandling',
    RevurderingInnvilgelse = 'RevurderingInnvilgelse',
    RevurderingOmgjøring = 'RevurderingOmgjøring',
    RevurderingStans = 'RevurderingStans',
}
