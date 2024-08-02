import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { Behandling } from '../types/BehandlingTypes';

export function useHentBehandling(behandlingId: string) {
  const {
    data: valgtBehandling,
    isLoading,
    error,
  } = useSWR<Behandling, FetcherError>(
    `/api/behandling/${behandlingId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );
  return { valgtBehandling, isLoading, error };
}
