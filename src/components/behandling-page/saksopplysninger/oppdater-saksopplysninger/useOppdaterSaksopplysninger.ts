import useSWRMutation from 'swr/mutation';
import { BehandlingData } from '../../../../types/BehandlingTypes';
import { FetcherError, throwErrorIfFatal } from '../../../../utils/http';

export const useOppdaterSaksopplysninger = (behandling: BehandlingData) => {
    const { sakId, id } = behandling;

    const { trigger, isMutating, error } = useSWRMutation<BehandlingData, FetcherError, string>(
        `/api/sak/${sakId}/behandling/${id}/saksopplysninger`,
        fetchOppdatertBehandling,
    );

    return {
        oppdaterOgHentBehandling: trigger,
        isLoading: isMutating,
        error,
    };
};

const fetchOppdatertBehandling = async (url: string) => {
    const res = await fetch(url, {
        method: 'PATCH',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
