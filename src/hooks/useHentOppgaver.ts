import useSWR from 'swr';
import { OppgaverForBenk } from '../types/BehandlingTypes';
import { fetcher } from '../utils/http';

export function useHentOppgaver() {
  const {
    data: oppgaver,
    isLoading,
    error,
    mutate,
  } = useSWR<OppgaverForBenk>(`/api/behandlinger`, fetcher);
  return { oppgaver, isLoading, error, mutate };
}
