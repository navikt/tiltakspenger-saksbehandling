import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { TiltakDeltagelseVilkår } from '../../types/TiltakDeltagelseTypes';

export function useHentTiltakDeltagelse(behandlingId: string) {
  const {
    data: tiltakDeltagelse,
    isLoading,
    error,
  } = useSWR<TiltakDeltagelseVilkår>(
    `/api/behandling/${behandlingId}/vilkar/tiltakdeltagelse`,
    fetcher,
  );
  return { tiltakDeltagelse, isLoading, error, mutate };
}
