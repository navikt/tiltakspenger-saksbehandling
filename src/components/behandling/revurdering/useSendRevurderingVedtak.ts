import { RevurderingData } from '~/types/BehandlingTypes';
import { VedtakRevurderingDTO } from '~/types/VedtakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useSendRevurderingVedtak = (behandling: RevurderingData) => {
    const {
        trigger: sendRevurderingTilBeslutning,
        isMutating: sendRevurderingTilBeslutningLaster,
        error: sendRevurderingTilBeslutningError,
    } = useFetchJsonFraApi<RevurderingData, VedtakRevurderingDTO>(
        `/sak/${behandling.sakId}/revurdering/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    return {
        sendRevurderingTilBeslutning,
        sendRevurderingTilBeslutningLaster,
        sendRevurderingTilBeslutningError,
    };
};
