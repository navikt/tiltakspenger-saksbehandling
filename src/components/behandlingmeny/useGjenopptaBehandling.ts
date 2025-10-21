import { Behandling, BehandlingId } from '~/types/Behandling';

import { SakId } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGjenopptaBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: gjenopptaBehandling,
        isMutating: isGjennopptaBehandlingMutating,
        error: gjenopptaBehandlingError,
    } = useFetchJsonFraApi<Behandling>(
        `/sak/${sakId}/behandling/${behandlingId}/gjenoppta`,
        'POST',
    );

    return { gjenopptaBehandling, isGjennopptaBehandlingMutating, gjenopptaBehandlingError };
};
