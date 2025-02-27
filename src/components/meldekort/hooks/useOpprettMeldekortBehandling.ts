import { MeldeperiodeKjedeId } from '../../../types/meldekort/Meldeperiode';
import { SakId } from '../../../types/SakTypes';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortBehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<MeldekortBehandlingProps>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
