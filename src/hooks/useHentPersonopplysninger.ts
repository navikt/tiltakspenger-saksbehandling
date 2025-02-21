import useSWR, { mutate } from 'swr';
import { fetcher } from '../utils/http';
import { SakId } from '../types/SakTypes';

export type Personopplysninger = {
    fnr: string;
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    skjerming: boolean;
    strengtFortrolig: boolean;
    fortrolig: boolean;
};

export function useHentPersonopplysninger(sakId: SakId) {
    const {
        data: personopplysninger,
        isLoading: isPersonopplysningerLoading,
        error,
    } = useSWR<Personopplysninger>(`/api/sak/${sakId}/personopplysninger`, fetcher);
    return { personopplysninger, isPersonopplysningerLoading, error, mutate };
}
