import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';

export const SøknadsbehandlingTiltak = () => {
    const { behandling } = useSøknadsbehandling();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const skjemaContext = useSøknadsbehandlingSkjema();
    const { resultat } = skjemaContext;

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return <BehandlingTiltak behandling={behandling} context={skjemaContext} dispatch={dispatch} />;
};
