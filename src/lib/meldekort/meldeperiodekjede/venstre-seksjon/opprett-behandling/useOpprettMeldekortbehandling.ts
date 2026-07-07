import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortbehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
