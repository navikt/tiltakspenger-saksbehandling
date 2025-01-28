import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import { MeldekortDTO } from '../../types/MeldekortTypes';

const mutateMeldekort = async (url, { arg }: { arg: MeldekortDTO }): Promise<unknown> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
};

type Props = {
    meldekortId: string;
    sakId: string;
    onSuccess?: () => void;
};

export function useSendMeldekortTilBeslutter({ meldekortId, sakId, onSuccess }: Props) {
    const {
        trigger: sendMeldekortTilBeslutter,
        isMutating: senderMeldekortTilBeslutter,
        error: feilVedSendingTilBeslutter,
        reset,
    } = useSWRMutation<any, FetcherError, any, MeldekortDTO>(
        `/api/sak/${sakId}/meldekort/${meldekortId}`,
        mutateMeldekort,
        { onSuccess },
    );

    return {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    };
}
