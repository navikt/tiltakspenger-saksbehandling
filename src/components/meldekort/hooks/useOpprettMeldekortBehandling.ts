import useSWRMutation from 'swr/mutation';
import { MeldeperiodeKjedeId } from '../../../types/meldekort/Meldeperiode';
import { SakId } from '../../../types/SakTypes';
import { FetcherError, throwErrorIfFatal } from '../../../utils/client-fetch';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortBehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useSWRMutation<MeldekortBehandlingProps, FetcherError>(
        `/api/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        fetcher,
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
