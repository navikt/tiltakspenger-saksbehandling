import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';
import { mutate } from 'swr';
import { finnOversiktslenke } from './useSendTilBeslutter';
import { BehandlingPropsDeprecated } from '../types/BehandlingTypes';
import { SakId } from '../types/SakTypes';

export function useGodkjennBehandling(behandlingId: string, sakId: SakId) {
    const {
        trigger: godkjennBehandling,
        isMutating: godkjennerBehandling,
        error: godkjennBehandlingError,
        reset,
    } = useSWRMutation<BehandlingPropsDeprecated, FetcherError>(
        `/api/sak/${sakId}/behandling/${behandlingId}/iverksett`,
        mutateBehandling,
        {
            onSuccess: (data) => {
                mutate('/api/behandlinger');
                mutate(`/api/behandling/${behandlingId}`);
                router.push(finnOversiktslenke(data.saksnummer, data.behandlingstype));
            },
        },
    );

    return {
        godkjennBehandling,
        godkjennerBehandling,
        godkjennBehandlingError,
        reset,
    };
}
