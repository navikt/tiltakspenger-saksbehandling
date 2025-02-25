import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingData, BehandlingId } from '../../../types/BehandlingTypes';
import { BehandlingPage } from '../../../components/behandling/BehandlingPage';
import React, { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import { BehandlingProvider } from '../../../components/behandling/context/BehandlingContext';
import { fetchBehandling } from '../../../utils/server-fetch';
import { logger } from '@navikt/next-logger';

type Props = {
    behandling: BehandlingData;
};

const Behandling = ({ behandling }: Props) => {
    return (
        <BehandlingProvider behandling={behandling}>
            <BehandlingPage />
        </BehandlingProvider>
    );
};

export const getServerSideProps: GetServerSideProps = pageWithAuthentication(async (context) => {
    const behandlingId = context.params!.behandlingId as BehandlingId;

    const behandling = await fetchBehandling(context.req, behandlingId).catch((e) => {
        logger.error(`Feil under henting av behandling med id ${behandlingId} - ${e.toString()}`);
        throw e;
    });

    return {
        props: { behandling } satisfies ComponentProps<typeof Behandling>,
    };
});

export default Behandling;
