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
    hendelseId: string;
    sakId: string;
    onSuccess?: () => void;
};

export const useOpprettMeldekortBehandling = ({ hendelseId, sakId, onSuccess }: Props) => {
    const { trigger, isMutating, error } = useSWRMutation(
        `/api/sak/${sakId}/meldeperiode/${hendelseId}/opprettBehandling`,
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
