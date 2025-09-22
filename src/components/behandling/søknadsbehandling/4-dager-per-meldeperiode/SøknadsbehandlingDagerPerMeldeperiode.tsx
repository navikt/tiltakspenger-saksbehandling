import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingDagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { resultat, behandlingsperiode, antallDagerPerMeldeperiode } = useBehandlingSkjema();

    if (resultat !== SøknadsbehandlingResultat.INNVILGELSE) {
        return null;
    }

    return (
        <>
            <Separator />
            <BehandlingDagerPerMeldeperiode
                antallDagerPerMeldeperiode={antallDagerPerMeldeperiode}
                behandlingsperiode={behandlingsperiode}
                rolleForBehandling={rolleForBehandling}
            />
        </>
    );
};
