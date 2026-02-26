import { Rammebehandling } from '~/types/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { FetcherError } from '~/utils/fetch/fetch';

export const useGodkjennBehandling = (behandling: Rammebehandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Rammebehandling, undefined, FetcherError<Rammebehandling>>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        'POST',
        {
            onError: (err, key, config) => {
                console.log("lol:", err, key, config)
            }
        }
    );

    return {
        godkjennBehandling: trigger,
        godkjennBehandlingLaster: isMutating,
        godkjennBehandlingError: error,
    };
};
