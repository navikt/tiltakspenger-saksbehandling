import useSWRMutation from 'swr/mutation';
import { throwErrorIfFatal } from '../../utils/http';

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};

type Props = {
    meldeperiodeId: string;
    sakId: string;
    onSuccess?: () => void;
};

export const useOpprettMeldekortBehandling = ({ meldeperiodeId, sakId, onSuccess }: Props) => {
    const { trigger, isMutating, error } = useSWRMutation(
        `/api/sak/${sakId}/meldeperiode/${meldeperiodeId}/opprettBehandling`,
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
