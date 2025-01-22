import useSWRMutation from 'swr/mutation';
import { throwErrorIfFatal } from '../../utils/http';

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};

export function useOpprettMeldekortBehandling(hendelseId: string, sakId: string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/api/sak/${sakId}/meldeperiode/${hendelseId}/opprettBehandling`,
        fetcher,
        {
            onSuccess: () => {
                window.location.reload();
            },
        },
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
}
