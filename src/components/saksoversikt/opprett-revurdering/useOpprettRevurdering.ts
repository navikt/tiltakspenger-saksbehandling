import { SakId } from '../../../types/Sak';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

import { VedtakOpprettRevurdering } from '../../../types/Vedtak';
import { Revurdering } from '~/types/Revurdering';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useFetchJsonFraApi<Revurdering, VedtakOpprettRevurdering>(
        `/sak/${sakId}/revurdering/start`,
        'POST',
    );

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};
