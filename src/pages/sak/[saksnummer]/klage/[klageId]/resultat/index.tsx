import { logger } from '@navikt/next-logger';
import React, { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { Button, Heading, HStack, LocalAlert, Process, VStack } from '@navikt/ds-react';
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
import {
    ArchiveIcon,
    CheckmarkCircleIcon,
    EnvelopeClosedIcon,
    PaperplaneIcon,
    PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import { formaterTidspunkt } from '~/utils/date';
import { skalKunneOppretteNyRammebehandling } from '~/utils/KlageinstanshendelseUtils';
import { useFerdigstillKlage } from '~/api/KlageApi';
import router from 'next/router';

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
            ) : klage.resultat === KlagebehandlingResultat.OPPRETTHOLDT ? (
                <OpprettholdResultat
                    sak={sak}
                    klage={klage}
                    omgjøringsbehandling={omgjøringsbehandling}
                    vedtakSomPåklages={vedtakSomPåklages}
                    søknader={søknader}
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

const OpprettholdResultat = (props: {
    sak: SakProps;
    klage: Klagebehandling;
    vedtakSomPåklages: Nullable<Rammevedtak>;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    søknader: Søknad[];
}) => {
    const [vilOppretteNyBehandling, setVilOppretteNyBehandling] = useState(false);

    const ferdigstillKlage = useFerdigstillKlage({
        sakId: props.sak.sakId,
        klageId: props.klage.id,
        onSuccess: (klage) => {
            router.push(`/sak/${klage.saksnummer}`);
        },
    });

    const journalført = !!props.klage.journalføringstidspunktInnstillingsbrev;
    const distribuert = !!props.klage.distribusjonstidspunktInnstillingsbrev;
    const oversendt = !!props.klage.oversendtKlageinstansenTidspunkt;

    const journalfører = !journalført && !distribuert && !oversendt;
    const distribuer = journalført && !distribuert && !oversendt;
    const oversender = journalført && distribuert && !oversendt;

    const journalførtEllerEtter = journalført || distribuert || oversendt;
    const distribuertEllerEtter = distribuert || oversendt;

    const fåttSvarFraKA = (props.klage.klageinstanshendelser?.length ?? 0) > 0;
    const oversendtEllerEtter = oversendt || fåttSvarFraKA;

    const kanOppretteNyRammebehandling =
        fåttSvarFraKA &&
        skalKunneOppretteNyRammebehandling(props.klage.klageinstanshendelser) &&
        !props.klage.rammebehandlingId;
    const kanFerdigstilleKlage =
        fåttSvarFraKA &&
        !skalKunneOppretteNyRammebehandling(props.klage.klageinstanshendelser) &&
        !props.klage.rammebehandlingId;

    return (
        <VStack gap="space-48" align="start">
            <HStack gap="space-8">
                {fåttSvarFraKA ? (
                    <CheckmarkCircleIcon title="Sjekk ikon" fontSize="1.5rem" color="green" />
                ) : (
                    <WarningCircleIcon />
                )}
                <Heading size="small">Resultat</Heading>
            </HStack>

            <Process>
                <Process.Event
                    status="completed"
                    title="Iverksettelse av opprettholdelse"
                    timestamp={formaterTidspunkt(props.klage.iverksattOpprettholdelseTidspunkt!)}
                    bullet={
                        <PaperplaneIcon
                            title="Iverksettelse av opprettholdelse"
                            fontSize="1.5rem"
                        />
                    }
                />
                <Process.Event
                    status={
                        journalførtEllerEtter
                            ? 'completed'
                            : journalfører
                              ? 'active'
                              : 'uncompleted'
                    }
                    title={
                        journalført
                            ? 'Journalført innstillingsbrev'
                            : 'Venter på journalføring av innstillingsbrev'
                    }
                    timestamp={
                        journalført
                            ? formaterTidspunkt(
                                  props.klage.journalføringstidspunktInnstillingsbrev!,
                              )
                            : undefined
                    }
                    bullet={
                        <ArchiveIcon title="Journalføring av innstillingsbrev" fontSize="1.5rem" />
                    }
                />

                <Process.Event
                    status={
                        distribuertEllerEtter ? 'completed' : distribuer ? 'active' : 'uncompleted'
                    }
                    title={
                        distribuert
                            ? 'Distribuert innstillingsbrev'
                            : 'Venter på distribusjon av innstillingsbrev'
                    }
                    timestamp={
                        distribuert
                            ? formaterTidspunkt(props.klage.distribusjonstidspunktInnstillingsbrev!)
                            : undefined
                    }
                    bullet={
                        <EnvelopeClosedIcon
                            title="Distribusjon av innstillingsbrev"
                            fontSize="1.5rem"
                        />
                    }
                />

                <Process.Event
                    status={
                        oversendtEllerEtter ? 'completed' : oversender ? 'active' : 'uncompleted'
                    }
                    title={
                        oversendtEllerEtter
                            ? 'Overført til Nav Klageinstans'
                            : 'Venter på overførsel til Nav Klageinstans'
                    }
                    timestamp={
                        oversendtEllerEtter
                            ? formaterTidspunkt(props.klage.oversendtKlageinstansenTidspunkt!)
                            : undefined
                    }
                    bullet={
                        <PersonHeadsetIcon
                            title="Overførsel til klageinstansen"
                            fontSize="1.5rem"
                        />
                    }
                />
                <Process.Event
                    title="Svar fra klageinstans"
                    status={fåttSvarFraKA ? 'completed' : 'uncompleted'}
                    bullet={<CheckmarkCircleIcon title="Fullført" fontSize="1.5rem" />}
                >
                    <Heading size="xsmall">Hendelseslogg</Heading>
                    <ul>
                        {props.klage.klageinstanshendelser?.map((hendelse) => (
                            <li key={hendelse.klagehendelseId}>
                                <span>{formaterTidspunkt(hendelse.opprettet)}</span>
                            </li>
                        ))}
                    </ul>
                </Process.Event>
            </Process>

            {ferdigstillKlage.error && (
                <LocalAlert status="error" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>
                            En feil skjedde under ferdigstilling av klage
                        </LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>{ferdigstillKlage.error.message}</LocalAlert.Content>
                </LocalAlert>
            )}

            {kanOppretteNyRammebehandling ? (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setVilOppretteNyBehandling(true)}
                >
                    Opprett ny behandling
                </Button>
            ) : kanFerdigstilleKlage ? (
                <Button
                    type="button"
                    loading={ferdigstillKlage.isMutating}
                    onClick={() => ferdigstillKlage.trigger()}
                >
                    Ferdigstill klagen
                </Button>
            ) : null}

            {vilOppretteNyBehandling && (
                <VelgOmgjøringsbehandlingModal
                    sakId={props.sak.sakId}
                    saksnummer={props.sak.saksnummer}
                    klageId={props.klage.id}
                    vedtakSomPåklages={props.vedtakSomPåklages}
                    søknader={props.søknader}
                    åpen={vilOppretteNyBehandling}
                    onClose={() => setVilOppretteNyBehandling(false)}
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
