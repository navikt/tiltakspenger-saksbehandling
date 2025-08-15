import { SøknadsbehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/types/SakTypes';
import { SøknadId } from '~/types/SøknadTypes';

export const useBehandleSøknadPåNytt = (sakId: SakId, søknadId: SøknadId) => {
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
