import { logger } from '@navikt/next-logger';
import React, { ReactElement } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider } from '../../layout';
import { Button, LocalAlert, VStack } from '@navikt/ds-react';
import { erKlageAvsluttet } from '~/utils/klageUtils';

type Props = {
    sak: SakProps;
    klage: Klagebehandling;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;
    const klageId = context.params!.klageId as KlageId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const klage = sak.klageBehandlinger.find((klage) => klage.id === klageId);

    if (!klage) {
        logger.error(`Fant ikke klage ${klageId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    return { props: { sak, klage } };
});

const ResultatPage = ({ sak, klage }: Props) => {
    return (
        <VStack gap="8" marginInline="16" marginBlock="8" maxWidth="30rem">
            {klage.resultat === KlagebehandlingResultat.OMGJØR ? (
                <Omgjøringsresultat sak={sak} klage={klage} />
            ) : (
                <>Ukjent resultat for klage</>
            )}
        </VStack>
    );
};

const Omgjøringsresultat = ({ klage }: Props) => {
    if (erKlageAvsluttet(klage)) {
        return null;
    }

    return (
        <VStack align="start" gap="8">
            <LocalAlert status="warning">
                <LocalAlert.Header>
                    <LocalAlert.Title>Omgjøring av vedtak</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres. En
                    behandling for å fatte nytt vedtak blir ikke automatisk opprettet. Dette må
                    gjøres manuelt.
                </LocalAlert.Content>
            </LocalAlert>

            <Button
                type="button"
                variant="primary"
                onClick={() => {
                    console.log('skal trigge en omgjøringsbehandling');
                }}
            >
                Opprett omgjøringsbehandling
            </Button>
        </VStack>
    );
};

ResultatPage.getLayout = function getLayout(page: ReactElement) {
    const { sak, klage } = page.props as Props;
    return (
        <KlageProvider klage={klage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.RESULTAT} klage={klage}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default ResultatPage;
