import { Behandling } from '~/types/Behandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useSendBehandlingTilBeslutning = (behandling: Behandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Behandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    return {
        sendTilBeslutning: trigger,
        sendTilBeslutningLaster: isMutating,
        sendTilBeslutningError: error,
    };
};
