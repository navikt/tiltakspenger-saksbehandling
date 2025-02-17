import React from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingId, BehandlingProps } from '../../../types/BehandlingTypes';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../../../utils/http';
import Varsel from '../../../components/varsel/Varsel';
import { Loader } from '@navikt/ds-react';
import { BehandlingPage } from '../../../components/behandling-page/BehandlingPage';

type Props = {
    behandlingId: BehandlingId;
};

const Behandling = ({ behandlingId }: Props) => {
    const {
        data: behandling,
        isLoading,
        error,
    } = useSWR<BehandlingProps, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

    if (error) {
        return (
            <Varsel
                variant={'error'}
                melding={`Kunne ikke hente behandling med id ${behandlingId} - [${error.status}] ${error.message}`}
            />
        );
    }

    if (isLoading || !behandling) {
        return <Loader />;
    }

    return <BehandlingPage behandling={behandling} />;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            behandlingId: context.params!.behandlingId as BehandlingId,
        } satisfies Props,
    };
});

export default Behandling;
