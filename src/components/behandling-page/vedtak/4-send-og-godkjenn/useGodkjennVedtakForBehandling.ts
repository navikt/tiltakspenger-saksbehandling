import { BehandlingData } from '../../../../types/BehandlingTypes';
import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../../utils/http';
import { EmptyObject } from '../../../../types/UtilTyper';

export const useGodkjennVedtakForBehandling = (behandling: BehandlingData) => {
    const { trigger, isMutating, error } = useSWRMutation<EmptyObject, FetcherError, string>(
        `/api/sak/${behandling.sakId}/behandling/${behandling.id}/iverksettv2`,
        fetchGodkjennBehandling,
        { throwOnError: false },
    );

    return {
        godkjennVedtak: trigger,
        isLoading: isMutating,
        error,
    };
};

const fetchGodkjennBehandling = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
