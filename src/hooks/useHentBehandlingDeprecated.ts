import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingPropsDeprecated } from '../types/BehandlingTypes';

export function useHentBehandlingDeprecated(behandlingId: string) {
    const {
        data: valgtBehandling,
        isLoading,
        error,
    } = useSWR<BehandlingPropsDeprecated, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

    return { valgtBehandling, isLoading, error };
}
