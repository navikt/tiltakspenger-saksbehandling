import { RevurderingResultat } from '~/types/BehandlingTypes';

import { Separator } from '~/components/separator/Separator';
import { DagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/DagerPerMeldeperiode';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '../context/RevurderingInnvilgelseVedtakContext';
import { AntallDagerForMeldeperiodeFormData } from '~/components/behandling/felles/state/AntallDagerState';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { hentRolleForBehandling } from '~/utils/tilganger';

const RevurderingDagerPerMeldeperiode = () => {
    const { behandling } = useRevurderingBehandling();

    const { behandlingsperiode, antallDagerPerMeldeperiode } = useRevurderingInnvilgelseSkjema();
    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();

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
                    <DagerPerMeldeperiode
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
export default RevurderingDagerPerMeldeperiode;
