import useSWR from 'swr';
import { fetcher, FetcherError } from '../../utils/http';
import { MeldekortUtenDager } from '../../types/MeldekortTypes';

export function useHentMeldekortListe(
  iverksatt: boolean,
  sakId: string,
) {
  const {
    data: meldekortliste,
    isLoading,
    error,
  } = useSWR<MeldekortUtenDager[], FetcherError>(
    () =>
      iverksatt ? `/api/vedtak/sak/${sakId}/meldekort` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  return { meldekortliste, isLoading, error };
}
