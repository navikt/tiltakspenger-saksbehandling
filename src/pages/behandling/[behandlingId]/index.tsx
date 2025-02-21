import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingData, BehandlingId } from '../../../types/BehandlingTypes';
import { BehandlingPage } from '../../../components/behandling-page/BehandlingPage';
import React, { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../../../utils/http';
import Varsel from '../../../components/varsel/Varsel';
import { Loader } from '@navikt/ds-react';
import { BehandlingProvider } from '../../../components/behandling-page/context/BehandlingContext';

type Props = {
    behandlingId: BehandlingId;
};

const Behandling = ({ behandlingId }: Props) => {
    const {
        data: behandling,
        isLoading,
        error,
    } = useSWR<BehandlingData, FetcherError>(`/api/behandling/${behandlingId}`, fetcher);

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

    return (
        <BehandlingProvider behandling={behandling}>
            <BehandlingPage />
        </BehandlingProvider>
    );
};

export const getServerSideProps: GetServerSideProps = pageWithAuthentication(async (context) => {
    return {
        props: {
            behandlingId: context.params!.behandlingId as BehandlingId,
        } satisfies ComponentProps<typeof Behandling>,
    };
});

export default Behandling;
