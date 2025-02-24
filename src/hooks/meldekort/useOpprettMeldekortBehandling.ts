import useSWRMutation from 'swr/mutation';
import { MeldeperiodeKjedeId } from '../../types/meldekort/Meldeperiode';
import { SakId } from '../../types/SakTypes';

import { throwErrorIfFatal } from '../../utils/client-fetch';

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
    onSuccess?: () => void;
};

export const useOpprettMeldekortBehandling = ({ kjedeId, sakId, onSuccess }: Props) => {
    const { trigger, isMutating, error } = useSWRMutation(
        `/api/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        fetcher,
        {
            onSuccess,
        },
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
