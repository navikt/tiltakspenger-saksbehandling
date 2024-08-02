import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';

export function useGodkjennBehandling(behandlingId: string) {
  const {
    trigger: godkjennBehandling,
    isMutating: godkjennerBehandling,
    error: godkjennBehandlingError,
  } = useSWRMutation<any, FetcherError, any, { id: string }>(
    `/api/behandling/godkjenn/${behandlingId}`,
    mutateBehandling,
  );

  return { godkjennBehandling, godkjennerBehandling, godkjennBehandlingError };
}
