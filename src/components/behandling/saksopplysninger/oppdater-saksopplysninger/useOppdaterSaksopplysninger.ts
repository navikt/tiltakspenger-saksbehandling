import { BehandlingData } from '../../../../types/BehandlingTypes';
import { useFetchFraApi } from '../../../../utils/useFetchFraApi';

export const useOppdaterSaksopplysninger = (behandling: BehandlingData) => {
    const { sakId, id } = behandling;

    const { trigger, isMutating, error } = useFetchFraApi<BehandlingData>(
        `/sak/${sakId}/behandling/${id}/saksopplysninger`,
        'PATCH',
    );

    return {
        oppdaterOgHentBehandling: trigger,
        isLoading: isMutating,
        error,
    };
};
