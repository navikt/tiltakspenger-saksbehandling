import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { mutate } from 'swr';
import router from 'next/router';

export function useGodkjennBehandling(behandlingId: string) {
  const {
    trigger: godkjennBehandling,
    isMutating: godkjennerBehandling,
    error: godkjennBehandlingError,
    reset,
  } = useSWRMutation<any, FetcherError, any, { id: string }>(
    `/api/behandling/godkjenn/${behandlingId}`,
    mutateBehandling,
    {
      onSuccess: () => {
        mutate(`/api/behandling/${behandlingId}`);
        router.push('/');
      },
    },
  );

  return {
    godkjennBehandling,
    godkjennerBehandling,
    godkjennBehandlingError,
    reset,
  };
}
