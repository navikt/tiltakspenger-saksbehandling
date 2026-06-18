import { logger } from '@navikt/next-logger';
import { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import {
    Klagebehandling,
    KlagebehandlingsresultatOmgjør,
    KlagebehandlingsresultatOpprettholdt,
    KlageId,
} from '~/lib/klage/typer/Klage';
import { SakProps } from '~/lib/sak/SakTyper';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { kanNavigereTilKlageSteg, KlageSteg } from '~/lib/klage/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { useForm } from 'react-hook-form';
import VurderingForm from '~/lib/klage/forms/klage-vurdering/VurderingForm';
import {
    harKlagevurderingsstegUtfylt,
    klagebehandlingTilVurderingFormData,
    VurderingFormData,
    vurderingFormDataTilVurderKlageRequest,
    vurderingFormValidation,
} from '~/lib/klage/forms/klage-vurdering/VurderingFormUtils';
import { BodyShort, Button, Heading, HStack, InfoCard, LocalAlert, VStack } from '@navikt/ds-react';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { useVurderKlage } from '~/lib/klage/api/KlageApi';
import WarningCircleIcon from '~/lib/_felles/icons/WarningCircleIcon';
import {
    erKlageAvsluttet,
    harKlageEnÅpenRammebehandling,
    erKlageOmgjøring,
    erKlageOpprettholdelse,
    finnSisteGyldigeStegForKlage,
    kanBehandleKlage,
    erKlageAvbrutt,
    erKlagebehandlingSattPåVent,
} from '~/lib/klage/utils/klageUtils';
import styles from './index.module.css';
import Link from 'next/link';
import { Søknad } from '~/types/Søknad';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Nullable, PartialRecord } from '~/types/UtilTypes';
import { erRammebehandlingUnderAktivOmgjøring } from '~/lib/rammebehandling/rammebehandlingUtils';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import Omgjøringsresultat from '~/lib/klage/Omgjøringsresultat';
import { OppsummeringAvVentestatuserModal } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortVedtak } from '~/lib/meldekort/typer/MeldekortVedtak';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import AvbrytKlagebehandlingModal from '~/lib/klage/modaler/avbryt/AvbrytKlagebehandlingModal';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling & {
        resultat: KlagebehandlingsresultatOmgjør | KlagebehandlingsresultatOpprettholdt | null;
    };
    omgjøringsbehandling: Nullable<Rammebehandling>;
    rammevedtak: Rammevedtak[];
    meldekortvedtak: MeldekortVedtak[];
    søknader: Søknad[];
    rammebehandlinger: Rammebehandling[];
    meldekortbehandlinger: PartialRecord<MeldekortbehandlingId, MeldekortbehandlingPropsV2>;
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
        sak.behandlinger.find((b) => initialKlage.åpenBehandlingId === b.id) ?? null;

    return {
        props: {
            sak,
            initialKlage: initialKlage as Klagebehandling & {
                resultat:
                    | KlagebehandlingsresultatOmgjør
                    | KlagebehandlingsresultatOpprettholdt
                    | null;
            },
            rammevedtak: sak.alleRammevedtak,
            meldekortvedtak: sak.meldekortvedtak,
            søknader: sak.søknader,
            omgjøringsbehandling: omgjøringsbehandling,
            rammebehandlinger: sak.behandlinger,
            meldekortbehandlinger: sak.meldekortbehandlinger,
        } satisfies Props,
    };
});

const VurderingKlagePage = ({
    sak,
    rammevedtak,
    meldekortvedtak,
    søknader,
    omgjøringsbehandling,
    rammebehandlinger,
    meldekortbehandlinger,
}: Props) => {
    const { klage, setKlage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [vilAvslutteBehandlingModal, setVilAvslutteBehandlingModal] = useState(false);
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>(
        !kanBehandleKlage(klage, omgjøringsbehandling) ||
            harKlagevurderingsstegUtfylt(klage) ||
            erKlagebehandlingSattPåVent(klage)
            ? 'LAGRET'
            : 'REDIGERER',
    );

    const erReadonlyForSaksbehandler = innloggetSaksbehandler.navIdent !== klage.saksbehandler;

    const form = useForm<VurderingFormData>({
        defaultValues: klagebehandlingTilVurderingFormData(klage),
        resolver: vurderingFormValidation,
    });

    const vurderKlage = useVurderKlage({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (oppdatertKlage) => {
            setKlage(oppdatertKlage);
            setFormTilstand('LAGRET');
        },
    });

    const onSubmit = (data: VurderingFormData) => {
        vurderKlage.trigger(vurderingFormDataTilVurderKlageRequest(data));
    };

    const kanNavigereVidere =
        (erKlageAvsluttet(klage) || erReadonlyForSaksbehandler) &&
        (kanNavigereTilKlageSteg(klage, KlageSteg.BREV) ||
            kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT));

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack
                    className={styles.formContainer}
                    gap="space-32"
                    marginBlock="space-32"
                    maxWidth="35rem"
                >
                    {!(klage.resultat === null && erKlageAvbrutt(klage)) && (
                        <HStack gap="space-8">
                            {formTilstand === 'LAGRET' ? (
                                <CheckmarkCircleIcon
                                    title="Sjekk ikon"
                                    fontSize="1.5rem"
                                    color="green"
                                />
                            ) : (
                                <WarningCircleIcon />
                            )}
                            <Heading size="small">Vurdering</Heading>
                        </HStack>
                    )}

                    {erKlageOmgjøring(klage) && harKlageEnÅpenRammebehandling(klage) && (
                        <InfoCard data-color="info" size="small">
                            <InfoCard.Header>
                                <InfoCard.Title>Informasjon om formkrav</InfoCard.Title>
                            </InfoCard.Header>
                            <InfoCard.Content>
                                Det er en åpen rammebehandling knyttet til klagen. Du kan kun gjøre
                                endringer som ikke påvirker resultatet, som å endre begrunnelse,
                                årsak og endre formkravene på en slik måte at de fremdeles er
                                oppfylt.
                            </InfoCard.Content>
                        </InfoCard>
                    )}

                    {!(klage.resultat === null && erKlageAvbrutt(klage)) && (
                        <VurderingForm
                            control={form.control}
                            kanOmgjøre={søknader.length > 0}
                            readonly={
                                erReadonlyForSaksbehandler ||
                                formTilstand === 'LAGRET' ||
                                (!!omgjøringsbehandling &&
                                    !erRammebehandlingUnderAktivOmgjøring(omgjøringsbehandling))
                            }
                        />
                    )}

                    {vurderKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved oppdatering av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{vurderKlage.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {!erReadonlyForSaksbehandler && formTilstand === 'REDIGERER' ? (
                        <Button className={styles.lagreKnapp} loading={vurderKlage.isMutating}>
                            Lagre
                        </Button>
                    ) : (
                        <HStack gap="space-16">
                            {!erReadonlyForSaksbehandler &&
                                kanBehandleKlage(klage, omgjøringsbehandling) &&
                                !erKlagebehandlingSattPåVent(klage) && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="tertiary"
                                            onClick={() => {
                                                setVilAvslutteBehandlingModal(true);
                                            }}
                                        >
                                            <HStack>
                                                <TrashIcon
                                                    title="Søppelbøtte ikon"
                                                    fontSize="1.5rem"
                                                />
                                                <BodyShort>Avslutt</BodyShort>
                                            </HStack>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="tertiary"
                                            onClick={() => setFormTilstand('REDIGERER')}
                                        >
                                            <HStack>
                                                <PencilIcon
                                                    title="Rediger ikon"
                                                    fontSize="1.5rem"
                                                />
                                                <BodyShort>Rediger</BodyShort>
                                            </HStack>
                                        </Button>
                                    </>
                                )}
                        </HStack>
                    )}
                </VStack>
            </form>

            {formTilstand === 'LAGRET' && (
                <VStack
                    className={styles.formContainer}
                    gap="space-32"
                    marginBlock="space-32"
                    maxWidth="35rem"
                    align="start"
                >
                    {erKlageOmgjøring(klage) && (
                        <Omgjøringsresultat
                            klage={klage}
                            rammevedtak={rammevedtak}
                            søknader={søknader}
                            rammebehandlinger={rammebehandlinger}
                            innloggetSaksbehandler={innloggetSaksbehandler}
                            meldekortvedtak={meldekortvedtak}
                            meldekortbehandlinger={meldekortbehandlinger}
                        />
                    )}

                    {erKlageOpprettholdelse(klage) ? (
                        <Button as={Link} href={`/sak/${sak.saksnummer}/klage/${klage.id}/brev`}>
                            Fortsett
                        </Button>
                    ) : (
                        kanNavigereVidere && (
                            <Button
                                className={styles.fortsettKnapp}
                                as={Link}
                                href={finnSisteGyldigeStegForKlage(klage)}
                            >
                                Fortsett
                            </Button>
                        )
                    )}
                    {klage.ventestatus.length > 0 && !erBehandlingSattPåVent(klage) && (
                        <OppsummeringAvVentestatuserModal
                            ventestatuser={klage.ventestatus}
                            button={{ variant: 'tertiary' }}
                        />
                    )}
                </VStack>
            )}
            {vilAvslutteBehandlingModal && (
                <AvbrytKlagebehandlingModal
                    åpen={vilAvslutteBehandlingModal}
                    onClose={() => setVilAvslutteBehandlingModal(false)}
                    sakId={sak.sakId}
                    klageId={klage.id}
                    saksnummer={sak.saksnummer}
                />
            )}
        </div>
    );
};

VurderingKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage } = page.props as Props;
    return (
        <KlageProvider initialKlage={initialKlage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.VURDERING}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};
export default VurderingKlagePage;
