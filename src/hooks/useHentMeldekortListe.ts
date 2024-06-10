import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { MeldekortUtenDager } from '../types/MeldekortTypes';

//TODO: Bruk vedtakId isf. behandlingId
export function useHentMeldekortListe(behandlingId: string) {
  const {
    data: meldekortliste,
    isLoading,
    error,
  } = useSWR<MeldekortUtenDager[]>(
    `/api/meldekort/hentAlleForBehandling/${behandlingId}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  return { meldekortliste, isLoading, error };
}
