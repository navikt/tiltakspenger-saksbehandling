import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchJsonFraApi } from '../../../../utils/fetch/useFetchFraApi';

export const useOppdaterSaksopplysninger = (behandling: BehandlingData) => {
    const { sakId, id } = behandling;

    const { trigger, isMutating, error } = useFetchJsonFraApi<BehandlingData>(
        `/sak/${sakId}/behandling/${id}/saksopplysninger`,
        'PATCH',
    );

    return {
        oppdaterOgHentBehandling: trigger,
        isLoading: isMutating,
        error,
    };
};
