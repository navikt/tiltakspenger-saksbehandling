import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateMeldekort } from '../../utils/http';
import { MeldekortDTO } from '../../types/MeldekortTypes';

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
