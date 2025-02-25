import useSWRMutation from 'swr/mutation';
import { BehandlingData, BehandlingId } from '../types/BehandlingTypes';

import { throwErrorIfFatal } from '../utils/client-fetch';

export const useTaBehandling = (behandlingId: BehandlingId) => {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useSWRMutation(`/api/behandling/tabehandling/${behandlingId}`, fetchTaBehandling);

    return { taBehandling, isBehandlingMutating, taBehandlingError };
};

const fetchTaBehandling = async (url: string): Promise<BehandlingData> => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
