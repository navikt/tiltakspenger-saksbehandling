import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { KvpVilkår } from '../types/Kvp';

export function useHentKvp(behandlingId: string) {
  const {
    data: kvp,
    isLoading,
    error,
  } = useSWR<KvpVilkår>(`/api/behandling/${behandlingId}/vilkar/kvp`, fetcher);
  return { kvp, isLoading, error, mutate };
}
