import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

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
    } = useFetchJsonFraApi<MeldekortBehandlingProps, MeldekortBehandlingDTO>(
        `/sak/${sakId}/meldekort/${meldekortId}`,
        'POST',
        { onSuccess },
    );

    return {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    };
};
