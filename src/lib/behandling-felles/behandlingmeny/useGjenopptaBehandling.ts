import { Rammebehandling, BehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGjenopptaBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: gjenopptaBehandling,
        isMutating: isGjennopptaBehandlingMutating,
        error: gjenopptaBehandlingError,
    } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sakId}/behandling/${behandlingId}/gjenoppta`,
        'POST',
    );

    return { gjenopptaBehandling, isGjennopptaBehandlingMutating, gjenopptaBehandlingError };
};
