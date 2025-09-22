import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { BehandlingDagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { Separator } from '~/components/separator/Separator';
import { AntallDagerForMeldeperiodeFormData } from '../../felles/state/AntallDagerState';
import { useSøknadsbehandling } from '../../context/BehandlingContext';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { resultat, behandlingsperiode, antallDagerPerMeldeperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const onDispatch = (antallDager: AntallDagerForMeldeperiodeFormData[]) => {
        dispatch({
            type: 'oppdaterAntallDagerForMeldeperiode',
            payload: { antallDager: antallDager },
        });
    };

    return (
        <div>
            {resultat === SøknadsbehandlingResultat.INNVILGELSE && (
                <>
                    <Separator />
                    <BehandlingDagerPerMeldeperiode
                        antallDagerPerMeldeperiode={antallDagerPerMeldeperiode}
                        behandlingsperiode={behandlingsperiode}
                        dispatch={onDispatch}
                        rolleForBehandling={rolleForBehandling}
                    />
                </>
            )}
        </div>
    );
};
