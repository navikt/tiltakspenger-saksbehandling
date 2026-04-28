import { SakId } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { Revurdering, StartRevurderingDTO } from '~/types/Revurdering';

export const useStartRevurdering = (sakId: SakId) => {
    const {
        trigger: startRevurdering,
        isMutating: startRevurderingLaster,
        error: startRevurderingError,
    } = useFetchJsonFraApi<Revurdering, StartRevurderingDTO>(
        `/sak/${sakId}/revurdering/start`,
        'POST',
    );

    return {
        startRevurdering,
        startRevurderingLaster,
        startRevurderingError,
    };
};
