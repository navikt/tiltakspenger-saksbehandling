import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingTiltak = () => {
    const skjemaContext = useBehandlingSkjema();
    const { resultat } = skjemaContext;

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return <BehandlingTiltak />;
};
