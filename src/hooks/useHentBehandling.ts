import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingId, BehandlingProps } from '../types/BehandlingTypes';

export function useHentBehandling(behandlingId: BehandlingId) {
    const {
        data: behandling,
        isLoading,
        error,
    } = useSWR<BehandlingProps, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

    return { behandling, isLoading, error };
}
