import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateMeldekort } from '../../utils/http';
import { MeldekortDTO } from '../../types/MeldekortTypes';

export function useSendMeldekortTilBeslutter(meldekortId: string, sakId: string) {
    const {
        trigger: sendMeldekortTilBeslutter,
        isMutating: senderMeldekortTilBeslutter,
        error: feilVedSendingTilBeslutter,
        reset,
    } = useSWRMutation<any, FetcherError, any, MeldekortDTO>(
        `/api/sak/${sakId}/meldekort/${meldekortId}`,
        mutateMeldekort,
    );

    return {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    };
}
