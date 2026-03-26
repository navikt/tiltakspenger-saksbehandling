import { logger } from '@navikt/next-logger';
import { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import {
    Klagebehandling,
    KlagebehandlingResultat,
    KlagebehandlingsresultatOmgjør,
    KlagebehandlingsresultatOpprettholdt,
    KlagebehandlingStatus,
    KlageId,
} from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { Button, Heading, HStack, InfoCard, LocalAlert, Process, VStack } from '@navikt/ds-react';
import {
    erKlageAvsluttet,
    erKlageMottattFraKAEllerEtter,
    erKlageUnderAktivOmgjøring,
} from '~/utils/klageUtils';
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
import {
    erKlageinstanshendelseAvsluttet,
    skalKunneOppretteNyRammebehandling,
} from '~/utils/KlageinstanshendelseUtils';
import styles from './index.module.css';
import OppsummeringAvKlageinstanshendelser from '~/components/oppsummeringer/klage/oppsummeringAvKlageinstanshendelser/OppsummeringAvKlageinstanshendelser';
import { KlageHendelseKlagebehandlingAvsluttetUtfall } from '~/types/Klageinstanshendelse';
import FerdigstillKlageModalWrapper from '~/components/modaler/FerdigstillKlagebehandlingModal';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtak: Rammevedtak[];
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

    const omgjøringsbehandling =
        sak.behandlinger.find((b) => initialKlage.åpenRammebehandlingId === b.id) ?? null;

    return {
        props: {
            sak,
            initialKlage: initialKlage,
            omgjøringsbehandling,
            vedtak: sak.alleRammevedtak,
            søknader: sak.søknader,
        },
    };
});

const ResultatPage = ({ sak, omgjøringsbehandling, vedtak, søknader }: Props) => {
    const { klage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const { resultat } = klage;

    if (!resultat || resultat.type === 'AVVIST') {
        return <>Ukjent resultat for klage</>;
    }

    return (
        <VStack className={styles.formContainer} gap="space-32" marginBlock="space-32">
            {resultat.type === KlagebehandlingResultat.OMGJØR ? (
                <Omgjøringsresultat
                    sak={sak}
                    klage={klage as Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør }}
                    omgjøringsbehandling={omgjøringsbehandling}
                    vedtak={vedtak}
                    søknader={søknader}
                    innloggetSaksbehandler={innloggetSaksbehandler}
                />
            ) : (
                <OpprettholdResultat
                    sak={sak}
                    klage={
                        klage as Klagebehandling & {
                            resultat: KlagebehandlingsresultatOpprettholdt;
                        }
                    }
                    omgjøringsbehandling={omgjøringsbehandling}
                    vedtak={vedtak}
                    søknader={søknader}
                    innloggetSaksbehandler={innloggetSaksbehandler}
                />
            )}
        </VStack>
    );
};

const Omgjøringsresultat = (props: {
    sak: SakProps;
    klage: Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør };
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtak: Rammevedtak[];
    søknader: Søknad[];
    innloggetSaksbehandler: Saksbehandler;
}) => {
    const erReadonlyForSaksbehandler =
        props.innloggetSaksbehandler.navIdent !== props.klage.saksbehandler;

    const [vilVelgeOmgjøringsbehandlingModal, setVilVelgeOmgjøringsbehandlingModal] =
        useState(false);

    return (
        <VStack align="start" gap="space-32" maxWidth="30rem">
            <InfoCard data-color="info">
                <InfoCard.Header>
                    <InfoCard.Title>Omgjøring av vedtak</InfoCard.Title>
                </InfoCard.Header>
                <InfoCard.Content>
                    Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres.
                    Klagebehandlingen blir automatisk ferdigstilt etter omgjøringsbehandlingen er
                    iverksatt.
                </InfoCard.Content>
            </InfoCard>

            {erKlageUnderAktivOmgjøring(props.klage) ? (
                <Button
                    as={Link}
                    variant="secondary"
                    href={behandlingUrl({
                        saksnummer: props.sak.saksnummer,
                        id: props.klage.resultat.rammebehandlingId,
                    })}
                >
                    Gå til omgjøringsbehandling
                </Button>
            ) : !erReadonlyForSaksbehandler ? (
                <HStack gap="space-16">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setVilVelgeOmgjøringsbehandlingModal(true)}
                    >
                        Velg omgjøringsbehandling
                    </Button>
                    {!erKlageAvsluttet(props.klage) && (
                        <FerdigstillKlageModalWrapper
                            sakId={props.sak.sakId}
                            klageId={props.klage.id}
                        />
                    )}
                </HStack>
            ) : null}
            {vilVelgeOmgjøringsbehandlingModal && (
                <VelgOmgjøringsbehandlingModal
                    sakId={props.sak.sakId}
                    saksnummer={props.sak.saksnummer}
                    klageId={props.klage.id}
                    vedtak={props.vedtak}
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
    klage: Klagebehandling & { resultat: KlagebehandlingsresultatOpprettholdt };
    vedtak: Rammevedtak[];
    omgjøringsbehandling: Nullable<Rammebehandling>;
    søknader: Søknad[];
    innloggetSaksbehandler: Saksbehandler;
}) => {
    const [vilOppretteNyBehandling, setVilOppretteNyBehandling] = useState(false);
    const erReadonlyForSaksbehandler =
        props.innloggetSaksbehandler.navIdent !== props.klage.saksbehandler;

    const journalført = !!props.klage.resultat.journalføringstidspunktInnstillingsbrev;
    const distribuert = !!props.klage.resultat.distribusjonstidspunktInnstillingsbrev;
    const oversendt = !!props.klage.resultat.oversendtKlageinstansenTidspunkt;

    const journalfører = !journalført && !distribuert && !oversendt;
    const distribuer = journalført && !distribuert && !oversendt;
    const oversender = journalført && distribuert && !oversendt;

    const journalførtEllerEtter = journalført || distribuert || oversendt;
    const distribuertEllerEtter = distribuert || oversendt;

    const fåttSvarFraKA = erKlageMottattFraKAEllerEtter(props.klage);
    const oversendtEllerEtter = oversendt || fåttSvarFraKA;

    const kanOppretteNyRammebehandling =
        fåttSvarFraKA &&
        skalKunneOppretteNyRammebehandling(props.klage.resultat.klageinstanshendelser) &&
        !props.klage.åpenRammebehandlingId &&
        !props.omgjøringsbehandling &&
        props.klage.status !== KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS &&
        !erReadonlyForSaksbehandler;

    const kanFerdigstilleKlage =
        fåttSvarFraKA &&
        !props.klage.åpenRammebehandlingId &&
        props.klage.status !== KlagebehandlingStatus.FERDIGSTILT &&
        props.klage.status !== KlagebehandlingStatus.VEDTATT &&
        !erReadonlyForSaksbehandler;

    const inneholderHendelserRetur = !!props.klage.resultat.klageinstanshendelser.find(
        (hendelse) =>
            erKlageinstanshendelseAvsluttet(hendelse) &&
            hendelse.utfall === KlageHendelseKlagebehandlingAvsluttetUtfall.RETUR,
    );

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
            <Process className={styles.process}>
                <Process.Event
                    status="completed"
                    title="Iverksettelse av opprettholdelse"
                    timestamp={formaterTidspunkt(
                        props.klage.resultat.iverksattOpprettholdelseTidspunkt!,
                    )}
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
                                  props.klage.resultat.journalføringstidspunktInnstillingsbrev!,
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
                            ? formaterTidspunkt(
                                  props.klage.resultat.distribusjonstidspunktInnstillingsbrev!,
                              )
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
                            ? formaterTidspunkt(
                                  props.klage.resultat.oversendtKlageinstansenTidspunkt!,
                              )
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
                    <OppsummeringAvKlageinstanshendelser
                        hendelser={props.klage.resultat.klageinstanshendelser}
                    />
                </Process.Event>
            </Process>

            {inneholderHendelserRetur && (
                <LocalAlert status="warning" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Ny klagebehandling må opprettes</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        Klagen inneholder retur fra klageinstansen. Denne klagen må ferdigstilles,
                        og en ny klagebehandling må opprettes.
                    </LocalAlert.Content>
                </LocalAlert>
            )}
            <HStack gap="space-16">
                {kanOppretteNyRammebehandling && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setVilOppretteNyBehandling(true)}
                    >
                        Opprett ny behandling
                    </Button>
                )}
                {props.omgjøringsbehandling && (
                    <Button
                        as={Link}
                        variant="secondary"
                        href={behandlingUrl({
                            saksnummer: props.sak.saksnummer,
                            id: props.omgjøringsbehandling.id,
                        })}
                    >
                        Gå til omgjøringsbehandling
                    </Button>
                )}
                {kanFerdigstilleKlage && (
                    <FerdigstillKlageModalWrapper
                        sakId={props.sak.sakId}
                        klageId={props.klage.id}
                    />
                )}
            </HStack>

            {vilOppretteNyBehandling && (
                <VelgOmgjøringsbehandlingModal
                    sakId={props.sak.sakId}
                    saksnummer={props.sak.saksnummer}
                    klageId={props.klage.id}
                    vedtak={props.vedtak}
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
