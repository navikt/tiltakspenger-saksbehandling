import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { mutate } from 'swr';

export function useGodkjennBehandling(behandlingId: string) {
  const {
    trigger: godkjennBehandling,
    isMutating: godkjennerBehandling,
    error: godkjennBehandlingError,
    reset
  } = useSWRMutation<any, FetcherError, any, { id: string }>(
    `/api/behandling/godkjenn/${behandlingId}`,
    mutateBehandling,
    { onSuccess: () => mutate(`/api/behandling/${behandlingId}`) },
  );

  return { godkjennBehandling, godkjennerBehandling, godkjennBehandlingError, reset };
}
