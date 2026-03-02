import { Rammebehandling } from '~/types/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { FetcherError } from '~/utils/fetch/fetch';

export const useGodkjennBehandling = (behandling: Rammebehandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`, 'POST', {
        throwOnError: true,
    });

    return {
        godkjennBehandling: trigger,
        godkjennBehandlingLaster: isMutating,
        godkjennBehandlingError: error,
    };
};
