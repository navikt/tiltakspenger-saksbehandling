import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

type OpprettMeldekortbehandlingBody = {
    kjedeIder: MeldeperiodeKjedeId[];
};

export const useOpprettMeldekortbehandling = (sakId: SakId) => {
    const {
        trigger: opprettMeldekortbehandling,
        isMutating: opprettMeldekortbehandlingLaster,
        error: opprettMeldekortbehandlingError,
    } = useFetchJsonFraApi<MeldekortbehandlingProps, OpprettMeldekortbehandlingBody>(
        `/sak/${encodeURIComponent(sakId)}/meldekort/opprettBehandling`,
        'POST',
    );

    return {
        opprettMeldekortbehandling,
        opprettMeldekortbehandlingLaster,
        opprettMeldekortbehandlingError,
    };
};
