import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { SakId } from '../../../types/SakTypes';

export const useLeggTilbakeMeldekortBehandling = (
    sakId: SakId,
    meldekortBehandlingId: MeldekortBehandlingId,
) => {
    const {
        trigger: leggTilbakeMeldekortBehandling,
        isMutating: isLeggTilbakeMeldekortBehandlingMutating,
        error: leggTilbakeMeldekortBehandlingError,
    } = useFetchJsonFraApi<MeldekortBehandlingProps>(
        `/sak/${sakId}/meldekort/${meldekortBehandlingId}/legg-tilbake`,
        'POST',
    );

    return {
        leggTilbakeMeldekortBehandling,
        isLeggTilbakeMeldekortBehandlingMutating,
        leggTilbakeMeldekortBehandlingError,
    };
};
