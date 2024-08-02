import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { UtbetalingVedtak } from '../types/Utbetaling';

export function useHentUtbetalingVedtak(utbetalingVedtakId?: string) {
  const {
    data: utbetalingVedtak,
    isLoading,
    error,
  } = useSWR<UtbetalingVedtak, FetcherError>(
    `/api/utbetaling/hentVedtak/${utbetalingVedtakId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );
  return { utbetalingVedtak, isLoading, error };
}
