import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { Meldekort } from '../types/MeldekortTypes';

export function useHentMeldekort(meldekortId?: string) {
  const {
    data: meldekort,
    mutate,
    isLoading,
    error,
  } = useSWR<Meldekort>(
    meldekortId ? `/api/meldekort/hentMeldekort/${meldekortId}` : null,
    fetcher
  );
  return { meldekort, isLoading, error, mutate };
}
