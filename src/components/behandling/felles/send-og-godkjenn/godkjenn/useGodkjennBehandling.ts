import { Behandling } from '~/types/Behandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGodkjennBehandling = (behandling: Behandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Behandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        'POST',
    );

    return {
        godkjennBehandling: trigger,
        godkjennBehandlingLaster: isMutating,
        godkjennBehandlingError: error,
    };
};
