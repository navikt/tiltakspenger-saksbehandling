import useSWR from 'swr';
import { fetcher, FetcherError } from '../../utils/http';
import { Meldekortsammendrag } from '../../types/MeldekortTypes';

export function useHentMeldekortListe(iverksatt: boolean, sakId: string) {
  const {
    data: meldekortliste,
    isLoading,
    error,
  } = useSWR<Meldekortsammendrag[], FetcherError>(
    () => (iverksatt && sakId ? `/api/sak/${sakId}/meldekort` : null),
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  return { meldekortliste, isLoading, error };
}
