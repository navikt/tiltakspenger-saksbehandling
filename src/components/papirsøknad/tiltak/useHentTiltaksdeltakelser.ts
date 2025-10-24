import useSWR, { mutate } from 'swr';
import { SakId } from '~/types/SakTypes';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { Tiltak } from '~/components/papirsøknad/papirsøknadTypes';

export const useHentTiltaksdeltakelser = (sakId: SakId, enabled: boolean = true) => {
    const { data, isLoading, error } = useSWR<Tiltak[]>(
        enabled ? ['tiltaksdeltakelser', sakId] : null,
        () => fetcher(sakId),
    );
    return { data, isLoading, error, mutate };
};

const fetcher = async (sakId: SakId) =>
    fetchJsonFraApiClientSide<Tiltak[]>(`/sak/${sakId}/tiltaksdeltakelser`);
