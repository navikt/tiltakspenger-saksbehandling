import { SakId } from '../../../../../types/Sak';
import { MeldekortBehandlingId } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldeperiodeKjedeProps } from '../../../../../types/meldekort/Meldeperiode';
import { useFetchJsonFraApi } from '../../../../../utils/fetch/useFetchFraApi';

export const useGodkjennMeldekort = (meldekortId: MeldekortBehandlingId, sakId: SakId) => {
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
