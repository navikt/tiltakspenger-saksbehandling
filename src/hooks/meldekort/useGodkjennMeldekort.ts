import useSWRMutation from 'swr/mutation';
import router from 'next/router';
import { SakId } from '../../types/SakTypes';
import { MeldekortBehandlingId } from '../../types/meldekort/MeldekortBehandling';

import { FetcherError, throwErrorIfFatal } from '../../utils/client-fetch';

export async function mutateMeldekort<R>(url: string, { arg }: { arg: any }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export function useGodkjennMeldekort(
    meldekortId: MeldekortBehandlingId,
    sakId: SakId,
    saksnummer: string,
) {
    const {
        trigger: onGodkjennMeldekort,
        isMutating: isMeldekortMutating,
        error: feilVedGodkjenning,
        reset,
    } = useSWRMutation<any, FetcherError, any, any>(
        `/api/sak/${sakId}/meldekort/${meldekortId}/iverksett`,
        mutateMeldekort,
        {
            onSuccess: () => {
                router.push(`/sak/${saksnummer}`);
            },
        },
    );

    return {
        onGodkjennMeldekort,
        isMeldekortMutating,
        feilVedGodkjenning,
        reset,
    };
}
