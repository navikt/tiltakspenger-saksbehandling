import useSWR, { mutate } from 'swr';
import { SakId } from '../sak/SakTyper';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

export type Personopplysninger = {
    fnr: SladdbarVerdi<string>;
    fødselsdato: SladdbarVerdi<string>;
    fornavn: SladdbarVerdi<Nullable<string>>;
    mellomnavn: SladdbarVerdi<Nullable<string>>;
    etternavn: SladdbarVerdi<Nullable<string>>;
    fortrolig: boolean;
    strengtFortrolig: boolean;
    strengtFortroligUtland: boolean;
    skjermet: boolean;
    dødsdato: SladdbarVerdi<Nullable<string>>;
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
