import { RevurderingData } from '../../../../types/BehandlingTypes';
import { RevurderTilStansVedtak } from '../../../../types/VedtakTyper';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

export const useSendRevurdering = (behandling: RevurderingData, vedtak: RevurderTilStansVedtak) => {
    const {
        trigger,
        isMutating: sendRevurderingTilBeslutterLaster,
        error: sendRevurderingTilBeslutterError,
    } = useFetchJsonFraApi<RevurderingData, RevurderTilStansVedtak>(
        `/sak/${behandling.sakId}/revurdering/${behandling.id}/sendtilbeslutning`,
        'POST',
    );

    const sendRevurderingTilBeslutter = () => trigger(vedtak);

    return {
        sendRevurderingTilBeslutter,
        sendRevurderingTilBeslutterLaster,
        sendRevurderingTilBeslutterError,
    };
};
