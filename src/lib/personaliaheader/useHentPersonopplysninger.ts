import useSWR, { mutate } from 'swr';
import { SakId } from '../sak/SakTyper';
import { fetchJsonFraApiClientSide } from '../../utils/fetch/fetch';

export type Personopplysninger = {
    fnr: string;
    fødselsdato: string;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fortrolig: boolean;
    strengtFortrolig: boolean;
    strengtFortroligUtland: boolean;
    skjermet: boolean;
    dødsdato?: string;
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
