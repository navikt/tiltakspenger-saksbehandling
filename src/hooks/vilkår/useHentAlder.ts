import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { AlderVilkår } from '../../types/AlderTypes';

export function useHentAlder(behandlingId: string) {
  const {
    data: alderVilkår,
    isLoading,
    error,
  } = useSWR<AlderVilkår>(
    `/api/behandling/${behandlingId}/vilkar/alder`,
    fetcher,
  );
  return { alderVilkår, isLoading, error, mutate };
}
