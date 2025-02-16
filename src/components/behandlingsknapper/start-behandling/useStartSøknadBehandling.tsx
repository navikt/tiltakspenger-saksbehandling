import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../utils/http';
import { BehandlingId, SøknadForOversikt } from '../../../types/BehandlingTypes';

type StartBehandlingResponse = { id: BehandlingId };

export const useStartSøknadBehandling = (søknad: SøknadForOversikt) => {
    const {
        trigger: opprettBehandling,
        isMutating: opprettBehandlingIsLoading,
        error: opprettBehandlingError,
    } = useSWRMutation<StartBehandlingResponse, FetcherError>(
        `/api/sak/${søknad.sakId}/soknad/${søknad.id}/startbehandling`,
        fetchStartBehandling,
    );

    return { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError };
};

const fetchStartBehandling = async (url: string): Promise<StartBehandlingResponse> => {
    const res = await fetch(url, {
        method: 'POST',
    });

    await throwErrorIfFatal(res);

    return res.json();
};
