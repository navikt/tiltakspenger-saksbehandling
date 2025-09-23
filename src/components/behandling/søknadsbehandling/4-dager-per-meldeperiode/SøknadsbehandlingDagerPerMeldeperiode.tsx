import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingDagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { resultat } = useBehandlingSkjema();

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return (
        <>
            <Separator />
            <BehandlingDagerPerMeldeperiode />
        </>
    );
};
