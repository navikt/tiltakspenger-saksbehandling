import { Rammebehandling } from '~/types/Behandling';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

export const useOppdaterSaksopplysninger = (behandling: Rammebehandling) => {
    const { sakId, id } = behandling;

    const { trigger, isMutating, error } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sakId}/behandling/${id}/saksopplysninger`,
        'PATCH',
    );

    return {
        oppdaterOgHentBehandling: trigger,
        isLoading: isMutating,
        error,
    };
};
