import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { Sak } from '../types/SakTypes';

export function useHentSak(saksnummer: string) {
  const {
    data: sak,
    isLoading,
    error,
  } = useSWR<Sak, FetcherError>(`/api/sak/${saksnummer}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  return { sak, isLoading, error };
}
