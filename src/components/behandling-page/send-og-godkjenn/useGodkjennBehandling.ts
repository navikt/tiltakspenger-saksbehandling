import { BehandlingData } from '../../../types/BehandlingTypes';
import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../utils/client-fetch';

export const useGodkjennBehandling = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useSWRMutation<BehandlingData, FetcherError, string>(
        `/api/sak/${behandling.sakId}/behandling/${behandling.id}/iverksett`,
        fetchGodkjennBehandling,
    );

    return {
        godkjennVedtak: trigger,
        godkjennVedtakLaster: isMutating,
        godkjennVedtakError: error,
    };
};

const fetchGodkjennBehandling = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
