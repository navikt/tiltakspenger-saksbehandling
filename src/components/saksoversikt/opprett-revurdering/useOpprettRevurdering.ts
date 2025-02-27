import { SakId } from '../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { RevurderingData } from '../../../types/BehandlingTypes';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useFetchJsonFraApi<RevurderingData>(`/sak/${sakId}/revurdering/start`, 'POST');

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};
