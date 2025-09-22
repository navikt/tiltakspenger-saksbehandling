import { RevurderingResultat } from '~/types/BehandlingTypes';
import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { AntallDagerForMeldeperiodeFormData } from '~/components/behandling/felles/state/AntallDagerState';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { hentRolleForBehandling } from '~/utils/tilganger';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingDagerPerMeldeperiode = () => {
    const { behandling } = useRevurderingBehandling();

    const { behandlingsperiode, antallDagerPerMeldeperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolle = hentRolleForBehandling(behandling, innloggetSaksbehandler);

    const onDispatch = (antallDager: AntallDagerForMeldeperiodeFormData[]) => {
        dispatch({
            type: 'oppdaterAntallDagerForMeldeperiode',
            payload: { antallDager: antallDager },
        });
    };
    return (
        <div>
            {behandling.resultat === RevurderingResultat.REVURDERING_INNVILGELSE && (
                <>
                    <Separator />
                    <BehandlingDagerPerMeldeperiode
                        antallDagerPerMeldeperiode={antallDagerPerMeldeperiode}
                        behandlingsperiode={behandlingsperiode}
                        dispatch={onDispatch}
                        rolleForBehandling={rolle}
                    />
                </>
            )}
        </div>
    );
};
