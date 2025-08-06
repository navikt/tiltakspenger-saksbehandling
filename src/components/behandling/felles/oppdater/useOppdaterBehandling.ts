import { BehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';

export const useOppdaterBehandling = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<BehandlingData, BehandlingVedtakDTO>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/oppdater`,
        'POST',
    );

    return {
        oppdaterBehandling: trigger,
        oppdaterBehandlingLaster: isMutating,
        oppdaterBehandlingError: error,
    };
};
