import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { Personopplysninger } from '../types/BehandlingTypes';

export function useHentPersonopplysninger(sakId: string) {
  const {
    data: personopplysninger,
    isLoading: isPersonopplysningerLoading,
    error,
  } = useSWR<Personopplysninger>(
    `/api/behandling/${sakId}/personopplysninger`,
    fetcher,
  );
  return { personopplysninger, isPersonopplysningerLoading, error, mutate };
}
