import { FetcherError, mutateBehandling } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import router from 'next/router';

export function useOpprettBehandling() {
    const {
        trigger: onOpprettBehandling,
        isMutating: isSøknadMutating,
        error: opprettBehandlingError,
    } = useSWRMutation<
        {
            id: string;
        },
        FetcherError,
        '/api/behandling/startbehandling',
        { id: string }
    >('/api/behandling/startbehandling', mutateBehandling, {
        onSuccess: (data) => router.push(`/behandling/${data.id}/vurderingsperiode`),
    });

    return { onOpprettBehandling, isSøknadMutating, opprettBehandlingError };
}
