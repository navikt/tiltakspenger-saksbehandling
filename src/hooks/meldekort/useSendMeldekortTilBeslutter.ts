import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import { MeldekortBehandlingDTO } from '../../types/meldekort/MeldekortBehandling';

const mutateMeldekort = async (
    url: string,
    { arg }: { arg: MeldekortBehandlingDTO },
): Promise<unknown> => {
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
    } = useSWRMutation<any, FetcherError, any, MeldekortBehandlingDTO>(
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
