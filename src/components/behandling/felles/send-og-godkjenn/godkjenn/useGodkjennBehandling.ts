import { Rammebehandling } from '~/types/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGodkjennBehandling = (behandling: Rammebehandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        'POST',
    );

    return {
        godkjennBehandling: trigger,
        godkjennBehandlingLaster: isMutating,
        godkjennBehandlingError: error,
    };
};
