import { SøknadsbehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useBehandleSøknadPåNytt = (sakId: string, søknadId: string) => {
    const {
        trigger: behandleSøknadPåNytt,
        isMutating: behandleSøknadPåNyttIsLoading,
        error: behandleSøknadPåNyttError,
    } = useFetchJsonFraApi<SøknadsbehandlingData>(
        `/sak/${sakId}/soknad/${søknadId}/behandling/ny-behandling`,
        'POST',
    );

    return { behandleSøknadPåNytt, behandleSøknadPåNyttIsLoading, behandleSøknadPåNyttError };
};
