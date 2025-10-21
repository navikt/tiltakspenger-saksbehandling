import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { SWRMutationConfiguration } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import { Behandling, BehandlingVedtak } from '~/types/Behandling';

type Props = {
    behandling: Behandling;
    options?: SWRMutationConfiguration<
        Behandling | undefined,
        FetcherError,
        string,
        BehandlingVedtak
    >;
};

export const useLagreBehandling = ({ behandling, options }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<Behandling, BehandlingVedtak>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/oppdater`,
        'POST',
        options,
    );

    return {
        lagreBehandling: trigger,
        lagreBehandlingLaster: isMutating,
        lagreBehandlingError: error,
    };
};
