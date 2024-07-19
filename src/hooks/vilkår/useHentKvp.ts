import useSWR, { mutate } from 'swr';
import { KvpVilkår } from '../../types/KvpTypes';
import { fetcher } from '../../utils/http';

export function useHentKvp(behandlingId: string) {
  const {
    data: kvp,
    isLoading,
    error,
  } = useSWR<KvpVilkår>(`/api/behandling/${behandlingId}/vilkar/kvp`, fetcher);
  return { kvp, isLoading, error, mutate };
}
