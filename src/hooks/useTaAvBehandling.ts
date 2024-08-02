import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';

export function useTaAvBehandling(behandlingId: string) {
  const {
    trigger: taAvBehandling,
    isMutating: tarAvBehandling,
    error: taAvBehandlingError,
  } = useSWRMutation<any, FetcherError, any>(
    `/api/behandling/avbrytbehandling/${behandlingId}`,
    mutateBehandling,
    {
      onSuccess: () => router.push('/'),
    },
  );

  return { taAvBehandling, tarAvBehandling, taAvBehandlingError };
}
