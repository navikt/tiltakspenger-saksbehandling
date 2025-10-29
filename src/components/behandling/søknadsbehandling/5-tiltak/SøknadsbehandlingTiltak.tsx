import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { RammebehandlingResultat } from '~/types/Behandling';

export const SøknadsbehandlingTiltak = () => {
    const skjemaContext = useBehandlingSkjema();
    const { resultat } = skjemaContext;

    if (resultat !== RammebehandlingResultat.INNVILGELSE) {
        return null;
    }

    return <BehandlingTiltak />;
};
