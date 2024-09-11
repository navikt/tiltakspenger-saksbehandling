import useSWR from 'swr';
import { UtbetalingVedtak } from '../../types/UtbetalingTypes';
import { FetcherError, fetcher } from '../../utils/http';

export function useHentUtbetalingVedtak(vedtakId: string) {
  const {
    data: utbetalingVedtak,
    isLoading,
    error,
  } = useSWR<UtbetalingVedtak, FetcherError>(
    `/api/utbetaling/hentVedtak/${vedtakId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );
  return { utbetalingVedtak, isLoading, error };
}
