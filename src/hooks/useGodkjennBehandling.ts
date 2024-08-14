import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';

export function useGodkjennBehandling(behandlingId: string) {
  const {
    trigger: godkjennBehandling,
    isMutating: godkjennerBehandling,
    error: godkjennBehandlingError,
  } = useSWRMutation<any, FetcherError, any, { id: string }>(
    `/api/behandling/godkjenn/${behandlingId}`,
    mutateBehandling,
    { onSuccess: () => router.push('/') },
  );

  return { godkjennBehandling, godkjennerBehandling, godkjennBehandlingError };
}
