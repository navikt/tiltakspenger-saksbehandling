import { useSøknadsbehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { ManueltBehandlesGrunnerInfo } from '~/lib/rammebehandling/felles/manuelt-behandles-grunner/ManueltBehandlesGrunnerInfo';

import style from './SøknadsbehandlingAutomatiskBehandling.module.css';

export const SøknadsbehandlingAutomatiskBehandling = () => {
    const { behandling } = useSøknadsbehandling();

    return (
        <>
            {behandling.automatiskSaksbehandlet && (
                <Infokort variant={'info'} size="small" className={style.infoboks}>
                    Saksbehandlingen er gjort automatisk.
                </Infokort>
            )}
            <ManueltBehandlesGrunnerInfo
                grunner={behandling.manueltBehandlesGrunner}
                className={style.infoboks}
            />
        </>
    );
};
