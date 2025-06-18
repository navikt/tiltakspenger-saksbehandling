import { BehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGodkjennBehandling = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<BehandlingData>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        'POST',
    );

    return {
        godkjennBehandling: trigger,
        godkjennBehandlingLaster: isMutating,
        godkjennBehandlingError: error,
    };
};
