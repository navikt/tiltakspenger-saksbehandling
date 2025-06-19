import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { SakId } from '../../types/SakTypes';
import { useFetchJsonFraApi } from '../../utils/fetch/useFetchFraApi';

export const useLeggTilbakeBehandling = (sakId: SakId, behandlingId: BehandlingId) => {
    const {
        trigger: leggTilbakeBehandling,
        isMutating: isLeggTilbakeBehandlingMutating,
        error: leggTilbakeBehandlingError,
    } = useFetchJsonFraApi<BehandlingData>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
        'POST',
    );

    return { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating, leggTilbakeBehandlingError };
};
