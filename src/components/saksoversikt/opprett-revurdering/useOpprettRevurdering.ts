import { SakId } from '../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { RevurderingData } from '../../../types/BehandlingTypes';
import { VedtakOpprettRevurderingDTO } from '../../../types/VedtakTyper';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useFetchJsonFraApi<RevurderingData, VedtakOpprettRevurderingDTO>(
        `/sak/${sakId}/revurdering/start`,
        'POST',
    );

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};
