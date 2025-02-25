import { SakId } from '../../../types/SakTypes';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { useFetchFraApi } from '../../../utils/useFetchFraApi';

export const useGodkjennMeldekort = (meldekortId: MeldekortBehandlingId, sakId: SakId) => {
    const {
        trigger: godkjennMeldekort,
        isMutating: godkjennMeldekortLaster,
        error: godkjennMeldekortFeil,
        reset,
    } = useFetchFraApi<MeldekortBehandlingProps>(
        `/sak/${sakId}/meldekort/${meldekortId}/iverksett`,
        'POST',
    );

    return {
        godkjennMeldekort,
        godkjennMeldekortLaster,
        godkjennMeldekortFeil,
        reset,
    };
};
