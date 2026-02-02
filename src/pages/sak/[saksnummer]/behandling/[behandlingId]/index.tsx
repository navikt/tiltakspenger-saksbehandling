import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BehandlingPage } from '~/components/behandling/BehandlingPage';
import React, { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import { BehandlingProvider } from '~/components/behandling/context/BehandlingContext';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProvider } from '~/context/sak/SakContext';
import { SakProps } from '~/types/Sak';
import { BehandlingId, Rammebehandling as BehandlingType } from '~/types/Rammebehandling';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandling: BehandlingType;
    sak: SakProps;
    klage: Nullable<Klagebehandling>;
};

const Behandling = ({ behandling, sak, klage }: Props) => {
    return (
        <BehandlingProvider behandling={behandling}>
            <SakProvider sak={sak}>
                <BehandlingPage klage={klage} />
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

    const behandlingensKlage =
        sak.klageBehandlinger.find((klage) => klage.id === behandling.klagebehandlingId) ?? null;

    return {
        props: { behandling, sak, klage: behandlingensKlage } satisfies ComponentProps<
            typeof Behandling
        >,
    };
});

export default Behandling;
