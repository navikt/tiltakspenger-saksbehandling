import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { RammebehandlingPage } from '~/lib/rammebehandling/RammebehandlingPage';
import { ComponentProps } from 'react';
import { GetServerSideProps } from 'next';
import { BehandlingProvider } from '~/lib/rammebehandling/context/BehandlingContext';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProvider } from '~/lib/sak/SakContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Klagebehandling } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandlingId: RammebehandlingId;
    sak: SakProps;
    klage: Nullable<Klagebehandling>;
};

const Behandling = ({ behandlingId, sak, klage }: Props) => {
    return (
        <SakProvider sak={sak}>
            <BehandlingProvider behandlingId={behandlingId} klagebehandling={klage}>
                <RammebehandlingPage />
            </BehandlingProvider>
        </SakProvider>
    );
};

export const getServerSideProps: GetServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;
    const behandlingId = context.params!.behandlingId as RammebehandlingId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const behandling = sak.rammebehandlinger.find((behandling) => behandling.id === behandlingId);

    if (!behandling) {
        logger.error(`Fant ikke behandlingen ${behandlingId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    const behandlingensKlage = behandling.klagebehandlingId
        ? sak.klagebehandlinger.find((klage) => klage.id === behandling.klagebehandlingId)
        : null;

    return {
        props: {
            behandlingId,
            sak,
            klage: behandlingensKlage ?? null,
        } satisfies ComponentProps<typeof Behandling>,
    };
});

export default Behandling;
