import useSWR, { mutate } from 'swr';
import { fetcher } from '../../utils/http';
import { LivsoppholdVilkår } from '../../types/LivsoppholdTypes';

export function useHentLivsopphold(behandlingId: string) {
    const {
        data: livsopphold,
        isLoading,
        error,
    } = useSWR<LivsoppholdVilkår>(`/api/behandling/${behandlingId}/vilkar/livsopphold`, fetcher);
    return { livsopphold, isLoading, error, mutate };
}
