import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { Revurdering, StartRevurderingDTO } from '~/lib/rammebehandling/typer/Revurdering';

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
