import useSWRMutation from 'swr/mutation';
import { throwErrorIfFatal } from '../utils/http';
import { BehandlingPropsDeprecated, BehandlingId } from '../types/BehandlingTypes';
import { mutate } from 'swr';

type TaBehandlingResponse = BehandlingPropsDeprecated;

export function useTaBehandling() {
    const {
        trigger: taBehandling,
        isMutating: isBehandlingMutating,
        error: taBehandlingError,
    } = useSWRMutation('/api/behandling/tabehandling', fetchTaBehandling, {
        onSuccess: () => {
            mutate('/api/behandlinger');
        },
    });

    return { taBehandling, isBehandlingMutating, taBehandlingError };
}

const fetchTaBehandling = async (
    url: string,
    { arg }: { arg: { id: BehandlingId } },
): Promise<TaBehandlingResponse> => {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
};
