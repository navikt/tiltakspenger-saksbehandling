import useSWR from 'swr';
import { UtbetalingListe } from '../../types/Utbetaling';
import { FetcherError, fetcher } from '../../utils/http';

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
