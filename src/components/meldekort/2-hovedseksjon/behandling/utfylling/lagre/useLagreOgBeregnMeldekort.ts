import {
    MeldekortBehandlingDTO,
    MeldekortBehandlingId,
} from '../../../../../../types/meldekort/MeldekortBehandling';
import { SakId } from '../../../../../../types/Sak';
import { useFetchJsonFraApi } from '../../../../../../utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '../../../../../../types/meldekort/Meldeperiode';

type Props = {
    meldekortId: MeldekortBehandlingId;
    sakId: SakId;
};

export const useLagreOgBeregnMeldekort = ({ meldekortId, sakId }: Props) => {
    const {
        trigger: sendLagreMeldekort,
        isMutating: sendLagreMeldekortLaster,
        error: sendLagreMeldekortFeil,
        reset,
    } = useFetchJsonFraApi<MeldeperiodeKjedeProps, MeldekortBehandlingDTO>(
        `/sak/${sakId}/meldekort/${meldekortId}/oppdater`,
        'POST',
    );

    return {
        sendLagreMeldekort,
        sendLagreMeldekortLaster,
        sendLagreMeldekortFeil,
        reset,
    };
};
