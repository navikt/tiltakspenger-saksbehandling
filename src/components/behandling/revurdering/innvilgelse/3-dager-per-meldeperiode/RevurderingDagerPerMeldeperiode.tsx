import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { hentRolleForBehandling } from '~/utils/tilganger';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingDagerPerMeldeperiode = () => {
    const { behandling } = useRevurderingBehandling();

    const { behandlingsperiode, antallDagerPerMeldeperiode } = useBehandlingSkjema();

    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolle = hentRolleForBehandling(behandling, innloggetSaksbehandler);

    return (
        <>
            <Separator />
            <BehandlingDagerPerMeldeperiode
                antallDagerPerMeldeperiode={antallDagerPerMeldeperiode}
                behandlingsperiode={behandlingsperiode}
                rolleForBehandling={rolle}
            />
        </>
    );
};
