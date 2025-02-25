import { BehandlingData } from '../../../types/BehandlingTypes';
import { useFetchFraApi } from '../../../utils/useFetchFraApi';

export const useGodkjennBehandling = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useFetchFraApi<BehandlingData>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        'POST',
    );

    return {
        godkjennVedtak: trigger,
        godkjennVedtakLaster: isMutating,
        godkjennVedtakError: error,
    };
};
