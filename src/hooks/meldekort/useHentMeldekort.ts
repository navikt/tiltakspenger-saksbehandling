import useSWR from 'swr';
import { Meldekort } from '../../types/MeldekortTypes';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldekort(
  meldekortId: string,
  sakId: string,
  fetch: boolean = true,
) {
  const {
    data: meldekort,
    mutate,
    isLoading,
    error,
  } = useSWR<Meldekort, FetcherError>(
    meldekortId &&
      sakId &&
      fetch &&
      `/api/sak/${sakId}/meldekort/${meldekortId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return { meldekort, isLoading, error, mutate };
}
