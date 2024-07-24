import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { KravfristVilkår } from '../../types/KravfristTypes';

export function useHentKravfrist(behandlingId: string) {
  const {
    data: kravfristVilkår,
    isLoading,
    error,
  } = useSWR<KravfristVilkår>(
    `/api/behandling/${behandlingId}/vilkar/kravfrist`,
    fetcher,
  );
  return { kravfristVilkår, isLoading, error, mutate };
}
