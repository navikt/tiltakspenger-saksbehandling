import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useTaBehandling = (behandlingId: BehandlingId) => {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useFetchJsonFraApi<BehandlingData>(`/behandling/tabehandling/${behandlingId}`, 'POST');

    return { taBehandling, isBehandlingMutating, taBehandlingError };
};
