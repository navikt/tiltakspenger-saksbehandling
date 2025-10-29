import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';

export const SøknadsbehandlingTiltak = () => {
    const skjemaContext = useBehandlingSkjema();
    const { resultat } = skjemaContext;

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return <BehandlingTiltak />;
};
