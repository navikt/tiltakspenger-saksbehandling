import { SakId } from '../../../types/Sak';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

import { Revurdering, OpprettRevurderingRequest } from '~/types/Revurdering';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useFetchJsonFraApi<Revurdering, OpprettRevurderingRequest>(
        `/sak/${sakId}/revurdering/start`,
        'POST',
    );

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};
