import { BehandlingDagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { RammebehandlingResultat } from '~/types/Behandling';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { resultat } = useBehandlingSkjema();

    if (resultat !== RammebehandlingResultat.INNVILGELSE) {
        return null;
    }

    return (
        <>
            <Separator />
            <BehandlingDagerPerMeldeperiode />
        </>
    );
};
