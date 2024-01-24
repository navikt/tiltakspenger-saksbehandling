import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { Meldekort } from '../types/MeldekortTypes';

//TODO: Bruk vedtakId isf. behandlingId
export function useHentMeldekortEnkelt(meldekortId: string) {
  const {
    data: meldekort,
    isLoading,
    error,
  } = useSWR<Meldekort>(`/api/meldekort/hentMeldekort/${meldekortId}`, fetcher);
  return { meldekort, isLoading, error };
}
