import useSWR from 'swr';
import { BehandlingEllerSøknadForOversiktData } from '../types/BehandlingTypes';

import { fetcher, FetcherError } from '../utils/client-fetch';

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
