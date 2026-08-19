import useSWR, { mutate } from 'swr';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { SakId } from '~/lib/sak/SakTyper';

export const useHentPersonopplysningerBarn = (sakId: SakId, enabled: boolean = true) => {
    const { data, isLoading, error } = useSWR<Personopplysninger[]>(
        enabled ? ['personopplysningerBarn', sakId] : null,
        () => fetcher(sakId),
    );
    return { data, isLoading, error, mutate };
};

const fetcher = async (sakId: SakId) =>
    fetchJsonFraApiClientSide<Personopplysninger[]>(`/sak/${sakId}/personopplysninger/barn`);
