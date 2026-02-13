import { logger } from '@navikt/next-logger';
import React, { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { Button, LocalAlert, VStack } from '@navikt/ds-react';
import { erKlageAvsluttet, erKlageUnderAktivOmgjøring } from '~/utils/klageUtils';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { behandlingUrl } from '~/utils/urls';
import { VelgOmgjøringsbehandlingModal } from '~/components/forms/velg-omgjøringsbehandling/VelgOmgjøringsbehandlingForm';
import { Søknad } from '~/types/Søknad';
import { Rammevedtak } from '~/types/Rammevedtak';
import Link from 'next/link';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { Saksbehandler } from '~/types/Saksbehandler';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtakSomPåklages: Nullable<Rammevedtak>;
    søknader: Søknad[];
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;
    const klageId = context.params!.klageId as KlageId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const initialKlage = sak.klageBehandlinger.find((klage) => klage.id === klageId);

    if (!initialKlage) {
        logger.error(`Fant ikke klage ${klageId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    const vedtakSomPåklages =
        sak.alleRammevedtak.find((vedtak) => vedtak.id === initialKlage.vedtakDetKlagesPå) ?? null;

    const omgjøringsbehandling =
        sak.behandlinger.find(
            (behandling) =>
                behandling.id === initialKlage.rammebehandlingId && behandling.avbrutt === null,
        ) || null;

    return {
        props: {
            sak,
            initialKlage: initialKlage,
            omgjøringsbehandling,
            vedtakSomPåklages: vedtakSomPåklages,
            søknader: sak.søknader,
        },
    };
});

const ResultatPage = ({ sak, omgjøringsbehandling, vedtakSomPåklages, søknader }: Props) => {
    const { klage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <VStack gap="space-32" marginInline="space-64" marginBlock="space-32" maxWidth="30rem">
            {klage.resultat === KlagebehandlingResultat.OMGJØR ? (
                <Omgjøringsresultat
                    sak={sak}
                    klage={klage}
                    omgjøringsbehandling={omgjøringsbehandling}
                    vedtakSomPåklages={vedtakSomPåklages}
                    søknader={søknader}
                    innloggetSaksbehandler={innloggetSaksbehandler}
                />
            ) : (
                <>Ukjent resultat for klage</>
            )}
        </VStack>
    );
};

const Omgjøringsresultat = (props: {
    sak: SakProps;
    klage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtakSomPåklages: Nullable<Rammevedtak>;
    søknader: Søknad[];
    innloggetSaksbehandler: Saksbehandler;
}) => {
    const erReadonlyForSaksbehandler =
        props.innloggetSaksbehandler.navIdent !== props.klage.saksbehandler;

    const [vilVelgeOmgjøringsbehandlingModal, setVilVelgeOmgjøringsbehandlingModal] =
        useState(false);

    if (erKlageAvsluttet(props.klage)) {
        return null;
    }

    return (
        <VStack align="start" gap="space-32">
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
            {erKlageUnderAktivOmgjøring(props.klage) ? (
                <Button
                    as={Link}
                    variant="secondary"
                    href={behandlingUrl({
                        saksnummer: props.sak.saksnummer,
                        id: props.klage.rammebehandlingId,
                    })}
                >
                    Gå til omgjøringsbehandling
                </Button>
            ) : !erReadonlyForSaksbehandler ? (
                <Button type="button" onClick={() => setVilVelgeOmgjøringsbehandlingModal(true)}>
                    Velg omgjøringsbehandling
                </Button>
            ) : null}
            {vilVelgeOmgjøringsbehandlingModal && (
                <VelgOmgjøringsbehandlingModal
                    sakId={props.sak.sakId}
                    saksnummer={props.sak.saksnummer}
                    klageId={props.klage.id}
                    vedtakSomPåklages={props.vedtakSomPåklages}
                    søknader={props.søknader}
                    åpen={vilVelgeOmgjøringsbehandlingModal}
                    onClose={() => setVilVelgeOmgjøringsbehandlingModal(false)}
                />
            )}
        </VStack>
    );
};

ResultatPage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage } = page.props as Props;

    return (
        <KlageProvider initialKlage={initialKlage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.RESULTAT}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default ResultatPage;
