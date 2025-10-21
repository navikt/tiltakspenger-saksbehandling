import { Behandling } from '~/types/Behandling';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

export const useOppdaterSaksopplysninger = (behandling: Behandling) => {
    const { sakId, id } = behandling;

    const { trigger, isMutating, error } = useFetchJsonFraApi<Behandling>(
        `/sak/${sakId}/behandling/${id}/saksopplysninger`,
        'PATCH',
    );

    return {
        oppdaterOgHentBehandling: trigger,
        isLoading: isMutating,
        error,
    };
};
