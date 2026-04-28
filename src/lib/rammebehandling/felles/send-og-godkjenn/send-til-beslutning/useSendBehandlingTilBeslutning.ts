import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { FetcherError } from '~/utils/fetch/fetch';

export const useSendBehandlingTilBeslutning = (behandling: Rammebehandling) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        undefined,
        FetcherError<Rammebehandling>
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/sendtilbeslutning`, 'POST');

    return {
        sendTilBeslutning: trigger,
        sendTilBeslutningLaster: isMutating,
        sendTilBeslutningError: error,
    };
};
