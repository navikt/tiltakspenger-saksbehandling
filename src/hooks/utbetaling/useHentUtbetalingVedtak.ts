import useSWR from 'swr';
import { UtbetalingVedtak } from '../../types/UtbetalingTypes';
import { FetcherError, fetcher } from '../../utils/http';

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
