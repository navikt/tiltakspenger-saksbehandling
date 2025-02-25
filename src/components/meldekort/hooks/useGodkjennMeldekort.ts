import useSWRMutation from 'swr/mutation';
import { SakId } from '../../../types/SakTypes';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';

import { FetcherError, throwErrorIfFatal } from '../../../utils/client-fetch';

export const useGodkjennMeldekort = (meldekortId: MeldekortBehandlingId, sakId: SakId) => {
    const {
        trigger: godkjennMeldekort,
        isMutating: godkjennMeldekortLaster,
        error: godkjennMeldekortFeil,
        reset,
    } = useSWRMutation<MeldekortBehandlingProps, FetcherError, any, any>(
        `/api/sak/${sakId}/meldekort/${meldekortId}/iverksett`,
        mutateMeldekort,
    );

    return {
        godkjennMeldekort,
        godkjennMeldekortLaster,
        godkjennMeldekortFeil,
        reset,
    };
};

export const mutateMeldekort = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
