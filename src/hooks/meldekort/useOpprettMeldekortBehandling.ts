import useSWRMutation from 'swr/mutation';
import { throwErrorIfFatal } from '../../utils/http';
import { MeldeperiodeKjedeId } from '../../types/meldekort/Meldeperiode';

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: string;
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
