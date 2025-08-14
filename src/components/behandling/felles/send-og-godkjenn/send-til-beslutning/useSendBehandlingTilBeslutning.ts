import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { BehandlingData } from '~/types/BehandlingTypes';

export const useSendBehandlingTilBeslutning = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<BehandlingData>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    return {
        sendTilBeslutning: trigger,
        sendTilBeslutningLaster: isMutating,
        sendTilBeslutningError: error,
    };
};
