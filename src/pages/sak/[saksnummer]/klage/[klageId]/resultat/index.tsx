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
} from '~/lib/klage/typer/Klage';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/lib/klage/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { Button, Heading, HStack, LocalAlert, Process, VStack } from '@navikt/ds-react';
import {
    erKlageAvsluttet,
    erKlageFerdigstilt,
    erKlageMottattFraKAEllerEtter,
    erKlageVedtatt,
    harKlageEnÅpenRammebehandling,
} from '~/lib/klage/utils/klageUtils';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { behandlingUrl } from '~/utils/urls';
import { VelgOmgjøringsbehandlingModal } from '~/lib/klage/forms/velg-omgjøringsbehandling/VelgOmgjøringsbehandlingForm';
import { Søknad } from '~/types/Søknad';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import Link from 'next/link';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    ArchiveIcon,
    CheckmarkCircleIcon,
    EnvelopeClosedIcon,
    PaperplaneIcon,
    PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import WarningCircleIcon from '~/lib/_felles/icons/WarningCircleIcon';
import { formaterTidspunkt } from '~/utils/date';
import {
    erKlageinstanshendelseAvsluttet,
    skalKunneOppretteNyRammebehandling,
} from '~/lib/klage/utils/KlageinstanshendelseUtils';
import styles from './index.module.css';
import OppsummeringAvKlageinstanshendelser from '~/lib/behandling-felles/oppsummeringer/klage/oppsummeringAvKlageinstanshendelser/OppsummeringAvKlageinstanshendelser';
import { KlageHendelseKlagebehandlingAvsluttetUtfall } from '~/lib/klage/typer/Klageinstanshendelse';
import FerdigstillKlageModalWrapper from '~/lib/klage/modaler/FerdigstillKlagebehandlingModal';
import Omgjøringsresultat from '~/lib/klage/Omgjøringsresultat';
import KlageTilknyttedeBehandlingerInfoCard from '~/lib/klage/KlageTilknyttedeBehandlingerInfoCard';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtak: Rammevedtak[];
    søknader: Søknad[];
    rammebehandlinger: Rammebehandling[];
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
            rammebehandlinger: sak.behandlinger,
        },
    };
});

const ResultatPage = ({
    sak,
    omgjøringsbehandling,
    vedtak,
    søknader,
    rammebehandlinger,
}: Props) => {
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
                    klage={klage as Klagebehandling & { resultat: KlagebehandlingsresultatOmgjør }}
                    vedtak={vedtak}
                    søknader={søknader}
                    innloggetSaksbehandler={innloggetSaksbehandler}
                    rammebehandlinger={rammebehandlinger}
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
                    rammebehandlinger={rammebehandlinger}
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
    rammebehandlinger: Rammebehandling[];
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
        !harKlageEnÅpenRammebehandling(props.klage) &&
        !erKlageVedtatt(props.klage) &&
        ((props.klage.status !== KlagebehandlingStatus.OMGJØRING_ETTER_KLAGEINSTANS &&
            !erReadonlyForSaksbehandler) ||
            erKlageFerdigstilt(props.klage));

    const kanFerdigstilleKlage =
        fåttSvarFraKA &&
        !harKlageEnÅpenRammebehandling(props.klage) &&
        !erKlageAvsluttet(props.klage) &&
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

            <KlageTilknyttedeBehandlingerInfoCard
                klage={props.klage}
                rammebehandlinger={props.rammebehandlinger}
            />
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

            {props.klage.ventestatus.length > 0 && (
                <OppsummeringAvVentestatuserModal
                    ventestatuser={props.klage.ventestatus}
                    button={{ variant: 'tertiary' }}
                />
            )}

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
