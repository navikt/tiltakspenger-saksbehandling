import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import { SWRMutationConfiguration } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';
import { Rammebehandling, OppdaterBehandlingDTO } from '~/types/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    options?: SWRMutationConfiguration<
        Rammebehandling,
        FetcherError,
        string,
        OppdaterBehandlingDTO
    >;
};

export const useLagreBehandling = ({ behandling, options }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        Rammebehandling,
        OppdaterBehandlingDTO
    >(`/sak/${behandling.sakId}/behandling/${behandling.id}/oppdater`, 'POST', options);

    return {
        lagreBehandling: trigger,
        lagreBehandlingLaster: isMutating,
        lagreBehandlingError: error,
    };
};
