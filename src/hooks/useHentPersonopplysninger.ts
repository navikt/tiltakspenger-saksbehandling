import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { Personopplysninger } from '../types/BehandlingTypes';
import { SakId } from '../types/SakTypes';

export function useHentPersonopplysninger(sakId: SakId) {
    const {
        data: personopplysninger,
        isLoading: isPersonopplysningerLoading,
        error,
    } = useSWR<Personopplysninger>(`/api/sak/${sakId}/personopplysninger`, fetcher);
    return { personopplysninger, isPersonopplysningerLoading, error, mutate };
}
