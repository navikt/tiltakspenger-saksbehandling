import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingTiltak = () => {
    const { behandling } = useSøknadsbehandling();
    const dispatch = useBehandlingSkjemaDispatch();
    const skjemaContext = useBehandlingSkjema();
    const { resultat } = skjemaContext;

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return <BehandlingTiltak behandling={behandling} context={skjemaContext} dispatch={dispatch} />;
};
