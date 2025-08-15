import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { BehandlingPage } from '~/components/behandling/BehandlingPage';
import React, { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import { BehandlingProvider } from '~/components/behandling/BehandlingContext';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProvider } from '~/context/sak/SakContext';
import { SakProps } from '~/types/SakTypes';

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
    const saksnummer = context.params!.saksnummer as string;
    const behandlingId = context.params!.behandlingId as BehandlingId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const behandling = sak.behandlinger.find((behandling) => behandling.id === behandlingId);

    if (!behandling) {
        logger.error(`Fant ikke behandlingen ${behandlingId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    return {
        props: { behandling, sak } satisfies ComponentProps<typeof Behandling>,
    };
});

export default Behandling;
