import { SakId } from '../../../types/SakTypes';
import { useFetchFraApi } from '../../../utils/useFetchFraApi';
import { RevurderingData } from '../../../types/BehandlingTypes';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useFetchFraApi<RevurderingData>(`/sak/${sakId}/revurdering/start`, 'POST');

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};
