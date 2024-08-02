import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { UtbetalingListe } from '../types/Utbetaling';

export function useHentUtbetalingListe(
  iverksatt: boolean,
  behandlingId: string,
) {
  const {
    data: utbetalingliste,
    isLoading,
    error,
  } = useSWR<UtbetalingListe[], FetcherError>(
    () =>
      iverksatt
        ? `/api/utbetaling/hentAlleForBehandling/${behandlingId}`
        : null,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return { utbetalingliste, isLoading, error };
}
