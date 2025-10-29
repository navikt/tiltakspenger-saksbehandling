import { BehandlingDagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';

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
