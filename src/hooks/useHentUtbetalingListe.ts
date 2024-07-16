import useSWR from 'swr';
import { fetcher } from '../utils/http';
import { UtbetalingListe } from '../types/Utbetaling';

export function useHentUtbetalingListe(
  iverksatt: boolean,
  behandlingId: string,
) {
  const {
    data: utbetalingliste,
    isLoading,
    error,
  } = useSWR<UtbetalingListe[]>(
    () =>
      iverksatt
        ? `/api/utbetaling/hentAlleForBehandling/${behandlingId}`
        : null,
    fetcher,
  );

  return { utbetalingliste, isLoading, error };
}
