import useSWR, { mutate } from 'swr';
import { SakId } from '../../types/Sak';
import { fetchJsonFraApiClientSide } from '../../utils/fetch/fetch';

export type Personopplysninger = {
    fnr: string;
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    skjerming: boolean;
    strengtFortrolig: boolean;
    fortrolig: boolean;
};

export const useHentPersonopplysninger = (sakId: SakId) => {
    const {
        data: personopplysninger,
        isLoading: isPersonopplysningerLoading,
        error,
    } = useSWR<Personopplysninger>(sakId, fetcher);
    return { personopplysninger, isPersonopplysningerLoading, error, mutate };
};

const fetcher = async (sakId: SakId) =>
    fetchJsonFraApiClientSide<Personopplysninger>(`/sak/${sakId}/personopplysninger`);
