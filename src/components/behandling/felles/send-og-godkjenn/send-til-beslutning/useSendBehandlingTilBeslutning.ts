import { Rammebehandling } from '~/types/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useSendBehandlingTilBeslutning = (behandling: Rammebehandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    return {
        sendTilBeslutning: trigger,
        sendTilBeslutningLaster: isMutating,
        sendTilBeslutningError: error,
    };
};
