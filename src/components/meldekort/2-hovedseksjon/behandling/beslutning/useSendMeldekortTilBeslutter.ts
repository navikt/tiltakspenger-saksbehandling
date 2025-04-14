import { MeldekortBehandlingDTO } from '../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../types/SakTypes';
import { useFetchJsonFraApi } from '../../../../../utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '../../../../../types/meldekort/Meldeperiode';

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
    } = useFetchJsonFraApi<MeldeperiodeKjedeProps, MeldekortBehandlingDTO>(
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
