import { SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { DagerPerMeldeperiode } from '../../felles/dager-per-meldeperiode/DagerPerMeldeperiode';
import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { Separator } from '~/components/separator/Separator';
import { AntallDagerForMeldeperiodeFormData } from '../../felles/state/AntallDagerState';
import { useSøknadsbehandling } from '../../context/BehandlingContext';

const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { resultat, behandlingsperiode, antallDagerPerMeldeperiode } =
        useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

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
                    <DagerPerMeldeperiode
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

export default SøknadsbehandlingDagerPerMeldeperiode;
