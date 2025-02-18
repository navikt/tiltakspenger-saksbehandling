import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingEllerSøknadForOversiktData } from '../types/BehandlingTypes';

export function useHentSøknaderOgBehandlinger() {
    const {
        data: søknaderOgBehandlinger,
        isLoading,
        error,
        mutate,
    } = useSWR<BehandlingEllerSøknadForOversiktData[], FetcherError>(`/api/behandlinger`, fetcher);

    return { søknaderOgBehandlinger, isLoading, error, mutate };
}
