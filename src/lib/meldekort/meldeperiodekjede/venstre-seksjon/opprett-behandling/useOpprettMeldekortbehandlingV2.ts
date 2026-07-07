import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortbehandlingV2 = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<MeldekortbehandlingPropsV2>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
