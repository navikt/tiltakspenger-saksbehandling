import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingDataDeprecated } from '../types/BehandlingTypes';

export function useHentBehandlingDeprecated(behandlingId: string) {
    const {
        data: valgtBehandling,
        isLoading,
        error,
    } = useSWR<BehandlingDataDeprecated, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

    return { valgtBehandling, isLoading, error };
}
