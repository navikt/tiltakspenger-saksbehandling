import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { BehandlingEllerSøknadForOversiktData } from '../types/BehandlingTypes';

export const useHentSøknaderOgBehandlinger = (
    initialData: BehandlingEllerSøknadForOversiktData[],
) => {
    const {
        data: søknaderOgBehandlinger,
        isLoading,
        error,
        mutate,
    } = useSWR<BehandlingEllerSøknadForOversiktData[], FetcherError>('/api/behandlinger', fetcher, {
        fallbackData: initialData,
    });

    return { søknaderOgBehandlinger, isLoading, error, mutate };
};
