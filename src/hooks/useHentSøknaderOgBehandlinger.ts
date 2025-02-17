import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingEllerSøknadForOversikt } from '../types/BehandlingTypes';

export function useHentSøknaderOgBehandlinger() {
    const {
        data: søknaderOgBehandlinger,
        isLoading,
        error,
        mutate,
    } = useSWR<BehandlingEllerSøknadForOversikt[], FetcherError>(`/api/behandlinger`, fetcher);

    return { søknaderOgBehandlinger, isLoading, error, mutate };
}
