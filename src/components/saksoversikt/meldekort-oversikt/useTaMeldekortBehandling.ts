import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

export const useTaMeldekortBehandling = (
    sakId: SakId,
    meldekortBehandlingId: MeldekortBehandlingId,
) => {
    const {
        trigger: taMeldekortBehandling,
        isMutating: isMeldekortBehandlingMutating,
        error: taMeldekortBehandlingError,
    } = useFetchJsonFraApi<MeldekortBehandlingProps>(
        `/sak/${sakId}/meldekort/${meldekortBehandlingId}/ta`,
        'POST',
    );

    return { taMeldekortBehandling, isMeldekortBehandlingMutating, taMeldekortBehandlingError };
};
