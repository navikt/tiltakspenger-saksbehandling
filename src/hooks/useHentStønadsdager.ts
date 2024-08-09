import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { Stønadsdager } from '../types/StønadsdagerTypes';

export function useHentStønadsdager(behandlingId: string) {
  const {
    data: stønadsdager,
    isLoading,
    error,
  } = useSWR<Stønadsdager>(
    `/api/behandling/${behandlingId}/stonadsdager`,
    fetcher,
  );
  return { stønadsdager, isLoading, error, mutate };
}
