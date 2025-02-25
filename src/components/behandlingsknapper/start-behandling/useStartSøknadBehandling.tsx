import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../utils/client-fetch';
import { FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import { SøknadForOversiktProps } from '../../../types/SøknadTypes';

export const useStartSøknadBehandling = (søknad: SøknadForOversiktProps) => {
    const {
        trigger: opprettBehandling,
        isMutating: opprettBehandlingIsLoading,
        error: opprettBehandlingError,
    } = useSWRMutation<FørstegangsbehandlingData, FetcherError>(
        `/api/sak/${søknad.sakId}/soknad/${søknad.id}/startbehandling`,
        fetchStartBehandling,
    );

    return { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError };
};

const fetchStartBehandling = async (url: string): Promise<FørstegangsbehandlingData> => {
    const res = await fetch(url, {
        method: 'POST',
    });

    await throwErrorIfFatal(res);

    return res.json();
};
