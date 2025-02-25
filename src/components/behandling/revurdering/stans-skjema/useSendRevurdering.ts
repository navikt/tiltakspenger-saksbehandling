import { RevurderingData } from '../../../../types/BehandlingTypes';
import { RevurderTilStansVedtak } from '../../../../types/VedtakTyper';
import { useFetchFraApi } from '../../../../utils/useFetchFraApi';

export const useSendRevurdering = (behandling: RevurderingData, vedtak: RevurderTilStansVedtak) => {
    const {
        trigger,
        isMutating: sendRevurderingTilBeslutterLaster,
        error: sendRevurderingTilBeslutterError,
    } = useFetchFraApi<RevurderingData, RevurderTilStansVedtak>(
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
