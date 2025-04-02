import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { SakId } from '../../types/SakTypes';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useTaBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useFetchJsonFraApi<BehandlingData>(`/sak/${sakId}/behandling/${behandlingId}/ta`, 'POST');

    return { taBehandling, isBehandlingMutating, taBehandlingError };
};
