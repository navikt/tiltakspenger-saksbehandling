import useSWR from 'swr';
import { Meldekort } from '../../types/MeldekortTypes';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldekort(meldekortId: string, sakId: string) {
  const {
    data: meldekort,
    mutate,
    isLoading,
    error,
  } = useSWR<Meldekort, FetcherError>(
    meldekortId && sakId && `/api/sak/${sakId}/meldekort/${meldekortId}`,
    fetcher,
  );

  return { meldekort, isLoading, error, mutate };
}
