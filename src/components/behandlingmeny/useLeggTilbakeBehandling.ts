import { Behandling, BehandlingId } from '~/types/Behandling';

import { SakId } from '../../types/Sak';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useLeggTilbakeBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: leggTilbakeBehandling,
        isMutating: isLeggTilbakeBehandlingMutating,
        error: leggTilbakeBehandlingError,
    } = useFetchJsonFraApi<Behandling>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
        'POST',
    );

    return { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating, leggTilbakeBehandlingError };
};
