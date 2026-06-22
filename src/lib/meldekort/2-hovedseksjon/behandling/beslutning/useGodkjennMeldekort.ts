import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGodkjennMeldekort = (meldekortId: MeldekortbehandlingId, sakId: SakId) => {
    const {
        trigger: godkjennMeldekort,
        isMutating: godkjennMeldekortLaster,
        error: godkjennMeldekortFeil,
        reset,
    } = useFetchJsonFraApi<SakProps>(`/sak/${sakId}/meldekort/${meldekortId}/iverksett`, 'POST');

    return {
        godkjennMeldekort,
        godkjennMeldekortLaster,
        godkjennMeldekortFeil,
        reset,
    };
};
