import { FørstegangsbehandlingData } from '../../../types/BehandlingTypes';
import { SøknadForOversiktProps } from '../../../types/SøknadTypes';
import { useFetchFraApi } from '../../../utils/useFetchFraApi';

export const useStartSøknadBehandling = (søknad: SøknadForOversiktProps) => {
    const {
        trigger: opprettBehandling,
        isMutating: opprettBehandlingIsLoading,
        error: opprettBehandlingError,
    } = useFetchFraApi<FørstegangsbehandlingData>(
        `/sak/${søknad.sakId}/soknad/${søknad.id}/startbehandling`,
        'POST',
    );

    return { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError };
};
