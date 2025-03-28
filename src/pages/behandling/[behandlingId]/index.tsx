import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingData, BehandlingId } from '../../../types/BehandlingTypes';
import { BehandlingPage } from '../../../components/behandling/BehandlingPage';
import React, { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import { BehandlingProvider } from '../../../components/behandling/BehandlingContext';
import { fetchBehandling, fetchSak } from '../../../utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProvider } from '../../../context/sak/SakContext';
import { SakProps } from '../../../types/SakTypes';

type Props = {
    behandling: BehandlingData;
    sak: SakProps;
};

const Behandling = ({ behandling, sak }: Props) => {
    return (
        <BehandlingProvider behandling={behandling}>
            <SakProvider sak={sak}>
                <BehandlingPage />
            </SakProvider>
        </BehandlingProvider>
    );
};

export const getServerSideProps: GetServerSideProps = pageWithAuthentication(async (context) => {
    const behandlingId = context.params!.behandlingId as BehandlingId;

    const behandling = await fetchBehandling(context.req, behandlingId).catch((e) => {
        logger.error(`Feil under henting av behandling med id ${behandlingId} - ${e.toString()}`);
        throw e;
    });

    const sak = await fetchSak(context.req, behandling.saksnummer).catch((e) => {
        logger.error(
            `Feil under henting av sak med saksnummer ${behandling.saksnummer} - ${e.toString()}`,
        );
        throw e;
    });

    return {
        props: { behandling, sak } satisfies ComponentProps<typeof Behandling>,
    };
});

export default Behandling;
