import { SakId } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
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
