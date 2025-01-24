import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateSak } from '../utils/http';
import router from 'next/router';
import { Periode } from '../types/Periode';
import { mutate } from 'swr';

export function useOpprettRevurdering(sakId: string, saksnummer: string) {
    const {
        trigger: opprettRevurdering,
        isMutating: oppretterBehandling,
        error: opprettRevurderingError,
    } = useSWRMutation<
        {
            id: string;
        },
        FetcherError,
        any,
        { periode: Periode }
    >(`/api/sak/${sakId}/revurdering`, mutateSak, {
        onSuccess: (data) => {
            mutate(`/api/sak/${saksnummer}`);
            router.push(`/behandling/${data.id}/vurderingsperiode`);
        },
    });

    return {
        opprettRevurdering,
        oppretterBehandling,
        opprettRevurderingError,
    };
}
