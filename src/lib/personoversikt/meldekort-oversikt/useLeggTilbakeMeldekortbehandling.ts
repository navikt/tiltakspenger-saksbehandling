import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/types/meldekort/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/types/Sak';

export const useLeggTilbakeMeldekortbehandling = (
    sakId: SakId,
    meldekortbehandlingId: MeldekortbehandlingId,
) => {
    const {
        trigger: leggTilbakeMeldekortbehandling,
        isMutating: isLeggTilbakeMeldekortbehandlingMutating,
        error: leggTilbakeMeldekortbehandlingError,
    } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/legg-tilbake`,
        'POST',
    );

    return {
        leggTilbakeMeldekortbehandling,
        isLeggTilbakeMeldekortbehandlingMutating,
        leggTilbakeMeldekortbehandlingError,
    };
};
