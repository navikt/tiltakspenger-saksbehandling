import useSWR from 'swr';
import { fetcher, FetcherError } from '../../utils/http';
import { Meldekortsammendrag } from '../../types/MeldekortTypes';

export function useHentMeldekortListe(sakId: string) {
  const {
    data: meldekortliste,
    isLoading,
    error,
  } = useSWR<Meldekortsammendrag[], FetcherError>(
    () => `/api/sak/${sakId}/meldekort`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  return { meldekortliste, isLoading, error };
}
