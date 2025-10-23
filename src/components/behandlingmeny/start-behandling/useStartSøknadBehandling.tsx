import { SøknadForOversikt } from '~/types/BehandlingForOversikt';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';

import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useStartSøknadBehandling = (søknad: SøknadForOversikt) => {
    const {
        trigger: opprettBehandling,
        isMutating: opprettBehandlingIsLoading,
        error: opprettBehandlingError,
    } = useFetchJsonFraApi<Søknadsbehandling>(
        `/sak/${søknad.sakId}/soknad/${søknad.id}/startbehandling`,
        'POST',
    );

    return { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError };
};
