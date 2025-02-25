import useSWRMutation from 'swr/mutation';
import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../types/SakTypes';

import { FetcherError, throwErrorIfFatal } from '../../../utils/client-fetch';

type Props = {
    meldekortId: string;
    sakId: SakId;
    onSuccess?: () => void;
};

export const useSendMeldekortTilBeslutter = ({ meldekortId, sakId, onSuccess }: Props) => {
    const {
        trigger: sendMeldekortTilBeslutter,
        isMutating: senderMeldekortTilBeslutter,
        error: feilVedSendingTilBeslutter,
        reset,
    } = useSWRMutation<MeldekortBehandlingProps, FetcherError, string, MeldekortBehandlingDTO>(
        `/api/sak/${sakId}/meldekort/${meldekortId}`,
        fetchSendMeldekortBehandling,
        { onSuccess },
    );

    return {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    };
};

const fetchSendMeldekortBehandling = async (
    url: string,
    { arg }: { arg: MeldekortBehandlingDTO },
): Promise<MeldekortBehandlingProps> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
};
