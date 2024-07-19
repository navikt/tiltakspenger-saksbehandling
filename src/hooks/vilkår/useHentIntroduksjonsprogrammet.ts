import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { IntroVilkår } from '../../types/IntroduksjonsprogrammetTypes';

export function useHentIntroduksjonsprogrammet(behandlingId: string) {
  const {
    data: intro,
    isLoading,
    error,
  } = useSWR<IntroVilkår>(
    `/api/behandling/${behandlingId}/vilkar/introduksjonsprogrammet`,
    fetcher,
  );
  return { intro, isLoading, error, mutate };
}
