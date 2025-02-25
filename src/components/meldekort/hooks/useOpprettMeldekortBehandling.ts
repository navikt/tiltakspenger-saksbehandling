import { MeldeperiodeKjedeId } from '../../../types/meldekort/Meldeperiode';
import { SakId } from '../../../types/SakTypes';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import { useFetchFraApi } from '../../../utils/useFetchFraApi';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortBehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchFraApi<MeldekortBehandlingProps>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'GET',
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
