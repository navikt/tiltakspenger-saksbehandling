import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

export const useLeggTilbakeMeldekortbehandling = (
    sakId: SakId,
    meldekortbehandlingId: MeldekortbehandlingId,
) => {
    const {
        trigger: leggTilbakeMeldekortbehandling,
        isMutating: isLeggTilbakeMeldekortbehandlingMutating,
        error: leggTilbakeMeldekortbehandlingError,
    } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/legg-tilbake`,
        'POST',
    );

    return {
        leggTilbakeMeldekortbehandling,
        isLeggTilbakeMeldekortbehandlingMutating,
        leggTilbakeMeldekortbehandlingError,
    };
};
