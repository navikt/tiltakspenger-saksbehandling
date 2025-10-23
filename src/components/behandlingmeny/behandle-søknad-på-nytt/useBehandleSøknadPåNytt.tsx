import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/types/Sak';
import { SøknadId } from '~/types/Søknad';
import { Søknadsbehandling } from '~/types/Søknadsbehandling';

export const useBehandleSøknadPåNytt = (sakId: SakId, søknadId: SøknadId) => {
    const {
        trigger: behandleSøknadPåNytt,
        isMutating: behandleSøknadPåNyttIsLoading,
        error: behandleSøknadPåNyttError,
    } = useFetchJsonFraApi<Søknadsbehandling>(
        `/sak/${sakId}/soknad/${søknadId}/behandling/ny-behandling`,
        'POST',
    );

    return { behandleSøknadPåNytt, behandleSøknadPåNyttIsLoading, behandleSøknadPåNyttError };
};
