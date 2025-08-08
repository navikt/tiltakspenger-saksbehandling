import { BehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { BehandlingVedtakDTO } from '~/types/VedtakTyper';
import { SWRMutationConfiguration } from 'swr/mutation';
import { FetcherError } from '~/utils/fetch/fetch';

type Props = {
    behandling: BehandlingData;
    options?: SWRMutationConfiguration<
        BehandlingData | undefined,
        FetcherError,
        string,
        BehandlingVedtakDTO
    >;
};

export const useLagreBehandling = ({ behandling, options }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<BehandlingData, BehandlingVedtakDTO>(
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
