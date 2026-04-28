import { Rammebehandling, BehandlingId } from '~/types/Rammebehandling';

import { SakId } from '../../types/Sak';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useTaBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useFetchJsonFraApi<Rammebehandling>(`/sak/${sakId}/behandling/${behandlingId}/ta`, 'POST');

    return { taBehandling, isBehandlingMutating, taBehandlingError };
};
