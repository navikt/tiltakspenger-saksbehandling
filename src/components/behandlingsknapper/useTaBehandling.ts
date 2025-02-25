import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { useFetchFraApi } from '../../utils/useFetchFraApi';

export const useTaBehandling = (behandlingId: BehandlingId) => {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useFetchFraApi<BehandlingData>(`/behandling/tabehandling/${behandlingId}`, 'POST');

    return { taBehandling, isBehandlingMutating, taBehandlingError };
};
