import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { TiltakDeltagelseVilkår } from '../../types/TiltakDeltagelseTypes';

export function useHentTiltaksdeltagelse(behandlingId: string) {
  const {
    data: tiltaksdeltagelse,
    isLoading,
    error,
  } = useSWR<TiltakDeltagelseVilkår>(
    `/api/behandling/${behandlingId}/vilkar/tiltakdeltagelse`,
    fetcher,
  );
  return { tiltaksdeltagelse, isLoading, error, mutate };
}
