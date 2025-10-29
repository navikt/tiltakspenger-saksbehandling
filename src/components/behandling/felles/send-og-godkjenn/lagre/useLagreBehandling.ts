import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { SWRMutationConfiguration } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import { Rammebehandling, RammebehandlingVedtakRequest } from '~/types/Behandling';

type Props = {
    behandling: Rammebehandling;
    options?: SWRMutationConfiguration<
        Rammebehandling | undefined,
        FetcherError,
        string,
        RammebehandlingVedtakRequest
    >;
};

export const useLagreBehandling = ({ behandling, options }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        RammebehandlingVedtakRequest
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/oppdater`, 'POST', options);

    return {
        lagreBehandling: trigger,
        lagreBehandlingLaster: isMutating,
        lagreBehandlingError: error,
    };
};
