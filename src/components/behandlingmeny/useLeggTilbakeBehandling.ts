import { Rammebehandling, BehandlingId } from '~/types/Rammebehandling';

import { SakId } from '../../types/Sak';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useLeggTilbakeBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: leggTilbakeBehandling,
        isMutating: isLeggTilbakeBehandlingMutating,
        error: leggTilbakeBehandlingError,
    } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
        'POST',
    );

    return { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating, leggTilbakeBehandlingError };
};
