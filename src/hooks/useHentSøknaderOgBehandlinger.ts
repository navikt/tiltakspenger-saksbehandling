import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { BehandlingForBenk } from '../types/BehandlingTypes';

export function useHentSøknaderOgBehandlinger() {
  const {
    data: SøknaderOgBehandlinger,
    isLoading,
    error,
    mutate,
  } = useSWR<BehandlingForBenk[]>(`/api/behandlinger`, fetcher);

  return { SøknaderOgBehandlinger, isLoading, error, mutate };
}
