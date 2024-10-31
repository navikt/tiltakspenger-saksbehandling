import useSWR, { mutate } from 'swr';
import { Stønadsdager } from '../../types/StønadsdagerTypes';
import { fetcher } from '../../utils/http';

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
