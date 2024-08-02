import useSWR from 'swr';
import { Meldekort } from '../../types/MeldekortTypes';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldekort(meldekortId?: string) {
  const {
    data: meldekort,
    mutate,
    isLoading,
    error,
  } = useSWR<Meldekort, FetcherError>(
    meldekortId && `/api/meldekort/hentMeldekort/${meldekortId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return { meldekort, isLoading, error, mutate };
}
