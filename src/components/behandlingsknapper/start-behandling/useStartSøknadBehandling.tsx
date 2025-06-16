import { SøknadsbehandlingData } from '~/types/BehandlingTypes';
import { SøknadForOversiktProps } from '~/types/SøknadTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useStartSøknadBehandling = (søknad: SøknadForOversiktProps) => {
    const {
        trigger: opprettBehandling,
        isMutating: opprettBehandlingIsLoading,
        error: opprettBehandlingError,
    } = useFetchJsonFraApi<SøknadsbehandlingData>(
        `/sak/${søknad.sakId}/soknad/${søknad.id}/startbehandling`,
        'POST',
    );

    return { opprettBehandling, opprettBehandlingIsLoading, opprettBehandlingError };
};
