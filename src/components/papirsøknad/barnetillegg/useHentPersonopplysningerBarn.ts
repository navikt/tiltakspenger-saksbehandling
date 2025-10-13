import useSWR, { mutate } from 'swr';
import { SakId } from '~/types/SakTypes';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { Personopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';

export const useHentPersonopplysningerBarn = (sakId: SakId, enabled: boolean = true) => {
    const { data, isLoading, error } = useSWR<Personopplysninger[]>(
        enabled ? ['personopplysningerBarn', sakId] : null,
        () => fetcher(sakId),
    );
    return { data, isLoading, error, mutate };
};

const fetcher = async (sakId: SakId) =>
    fetchJsonFraApiClientSide<Personopplysninger[]>(`/sak/${sakId}/personopplysninger/barn`);
