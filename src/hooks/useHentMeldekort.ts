import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { Meldekort } from '../types/MeldekortTypes';

export function useHentMeldekort(meldekortId: string) {
  const {
    data: meldekort,
    isLoading,
    error,
  } = useSWR<Meldekort>(`/api/meldekort/hentMeldekort/${meldekortId}`, fetcher);
  return { meldekort, isLoading, error };
}
