import useSWR from 'swr';
import { BehandlingForBenk } from '../types/Behandling';
import { fetcher } from '../utils/http';

export function useHentBehandlinger() {
  const {
    data: behandlinger,
    isLoading,
    error,
    mutate,
  } = useSWR<BehandlingForBenk[]>(`/api/behandlinger`, fetcher);
  return { behandlinger, isLoading, error, mutate };
}
