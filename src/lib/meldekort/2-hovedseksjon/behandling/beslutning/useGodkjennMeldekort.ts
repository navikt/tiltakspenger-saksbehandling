import { SakId } from '~/types/Sak';
import { MeldekortbehandlingId } from '~/types/meldekort/Meldekortbehandling';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useGodkjennMeldekort = (meldekortId: MeldekortbehandlingId, sakId: SakId) => {
    const {
        trigger: godkjennMeldekort,
        isMutating: godkjennMeldekortLaster,
        error: godkjennMeldekortFeil,
        reset,
    } = useFetchJsonFraApi<MeldeperiodeKjedeProps>(
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
