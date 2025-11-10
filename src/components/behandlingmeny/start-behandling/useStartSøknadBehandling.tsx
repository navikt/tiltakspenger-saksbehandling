import { SøknadUtenBehandling } from '~/types/ÅpenBehandlingForOversikt';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useStartSøknadBehandling = (søknad: SøknadUtenBehandling) => {
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
