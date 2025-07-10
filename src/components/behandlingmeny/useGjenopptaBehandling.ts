import { BehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { SakId } from '~/types/SakTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGjenopptaBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: gjenopptaBehandling,
        isMutating: isGjennopptaBehandlingMutating,
        error: gjenopptaBehandlingError,
    } = useFetchJsonFraApi<BehandlingData>(
        `/sak/${sakId}/behandling/${behandlingId}/gjenoppta`,
        'POST',
    );

    return { gjenopptaBehandling, isGjennopptaBehandlingMutating, gjenopptaBehandlingError };
};
