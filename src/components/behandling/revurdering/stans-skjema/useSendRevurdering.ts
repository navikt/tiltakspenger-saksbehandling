import useSWRMutation from 'swr/mutation';
import { RevurderingData } from '../../../../types/BehandlingTypes';
import { RevurderTilStansVedtak } from '../../../../types/VedtakTyper';

import { FetcherError, throwErrorIfFatal } from '../../../../utils/client-fetch';

export const useSendRevurdering = (behandling: RevurderingData, vedtak: RevurderTilStansVedtak) => {
    const {
        trigger,
        isMutating: sendRevurderingTilBeslutterLaster,
        error: sendRevurderingTilBeslutterError,
    } = useSWRMutation<RevurderingData, FetcherError, string, RevurderTilStansVedtak>(
        `/api/sak/${behandling.sakId}/revurdering/${behandling.id}/sendtilbeslutning`,
        fetchSendRevurdering,
    );

    const sendRevurderingTilBeslutter = () => trigger(vedtak);

    return {
        sendRevurderingTilBeslutter,
        sendRevurderingTilBeslutterLaster,
        sendRevurderingTilBeslutterError,
    };
};

const fetchSendRevurdering = async (
    url: string,
    { arg }: { arg: RevurderTilStansVedtak },
): Promise<RevurderingData> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
};
