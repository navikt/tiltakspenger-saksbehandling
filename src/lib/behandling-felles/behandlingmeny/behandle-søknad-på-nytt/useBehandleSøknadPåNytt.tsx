import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/lib/sak/SakTyper';
import { SøknadId } from '~/types/Søknad';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';

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
