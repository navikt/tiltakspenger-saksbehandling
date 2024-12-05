import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateSak } from '../utils/http';
import router from 'next/router';
import { Periode } from '../types/Periode';

export function useOpprettRevurdering(sakId: string) {
  const {
    trigger: opprettRevurdering,
    isMutating: oppretterBehandling,
    error: opprettRevurderingError,
    reset,
  } = useSWRMutation<any, FetcherError, any, Periode>(
    `/api/sak/${sakId}/revurdering`,
    mutateSak,
    {
      onSuccess: (data) => {
        router.push(`/behandling/${data.id}`);
      },
    },
  );

  return {
    opprettRevurdering,
    oppretterBehandling,
    opprettRevurderingError,
    reset,
  };
}
