import useSWR from 'swr';
import { fetcher, FetcherError } from '../../utils/http';
import { MeldekortUtenDager } from '../../types/MeldekortTypes';

export function useHentMeldekortListe(
  iverksatt: boolean,
  behandlingId: string,
) {
  const {
    data: meldekortliste,
    isLoading,
    error,
  } = useSWR<MeldekortUtenDager[], FetcherError>(
    () =>
      iverksatt ? `/api/meldekort/hentAlleForBehandling/${behandlingId}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  return { meldekortliste, isLoading, error };
}
