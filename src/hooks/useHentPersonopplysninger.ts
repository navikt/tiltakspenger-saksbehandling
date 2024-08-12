import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { Personopplysninger } from '../types/BehandlingTypes';

export function useHentPersonopplysninger(behandlingId: string) {
  const {
    data: personopplysninger,
    isLoading: isPersonopplysningerLoading,
    error,
  } = useSWR<Personopplysninger>(
    `/api/behandling/${behandlingId}/personopplysninger`,
    fetcher,
  );
  return { personopplysninger, isPersonopplysningerLoading, error, mutate };
}
