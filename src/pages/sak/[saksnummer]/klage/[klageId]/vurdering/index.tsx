import { logger } from '@navikt/next-logger';
import { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { useForm } from 'react-hook-form';
import VurderingForm from '~/components/forms/klage-vurdering/VurderingForm';
import {
    harKlagevurderingsstegUtfylt,
    klagebehandlingTilVurderingFormData,
    VurderingFormData,
    vurderingFormDataTilVurderKlageRequest,
    vurderingFormValidation,
} from '~/components/forms/klage-vurdering/VurderingFormUtils';
import { BodyShort, Button, Heading, HStack, InfoCard, LocalAlert, VStack } from '@navikt/ds-react';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { useAvbrytKlagebehandling, useVurderKlage } from '~/api/KlageApi';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import router from 'next/router';
import {
    erKlageAvsluttet,
    erKlageKnyttetTilRammebehandling,
    erKlageOmgjøring,
    erKlageUnderAktivOmgjøring,
    finnUrlForKlageSteg,
    kanBehandleKlage,
} from '~/utils/klageUtils';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';
import styles from './index.module.css';
import Link from 'next/link';
import { behandlingUrl } from '~/utils/urls';
import { VelgOmgjøringsbehandlingModal } from '~/components/forms/velg-omgjøringsbehandling/VelgOmgjøringsbehandlingForm';
import { Søknad } from '~/types/Søknad';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { erRammebehandlingUnderAktivOmgjøring } from '~/utils/behandling';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling>;
    vedtakOgBehandling: Array<{ vedtak: Rammevedtak; behandling: Rammebehandling }>;
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

    const rammevedtakOgBehandling = sak.alleRammevedtak.map((vedtak) => {
        const behandling = sak.behandlinger.find(
            (behandling) => behandling.id === vedtak.behandlingId,
        ) as Rammebehandling;

        return { vedtak, behandling };
    });

    const omgjøringsbehandling =
        sak.behandlinger.find((behandling) =>
            sak.klageBehandlinger.some((klage) => klage.rammebehandlingId === behandling.id),
        ) || null;

    return {
        props: {
            sak,
            initialKlage,
            vedtakOgBehandling: rammevedtakOgBehandling,
            søknader: sak.søknader,
            omgjøringsbehandling: omgjøringsbehandling,
        },
    };
});

const VurderingKlagePage = ({ sak, vedtakOgBehandling, søknader, omgjøringsbehandling }: Props) => {
    const { klage, setKlage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const [vilAvslutteBehandlingModal, setVilAvslutteBehandlingModal] = useState(false);
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>(
        !kanBehandleKlage(klage, omgjøringsbehandling) || harKlagevurderingsstegUtfylt(klage)
            ? 'LAGRET'
            : 'REDIGERER',
    );
    const [vilVelgeOmgjøringsbehandlingModal, setVilVelgeOmgjøringsbehandlingModal] =
        useState(false);

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

    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: klage.sakId,
        klageId: klage.id,
        onSuccess: () => {
            router.push(`/sak/${sak.saksnummer}`);
        },
    });

    const onSubmit = (data: VurderingFormData) => {
        vurderKlage.trigger(vurderingFormDataTilVurderKlageRequest(data));
    };

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack
                    gap="space-32"
                    marginInline="space-64"
                    marginBlock="space-32"
                    maxWidth="35rem"
                >
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

                    {erKlageOmgjøring(klage) && erKlageKnyttetTilRammebehandling(klage) && (
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

                    <VurderingForm
                        control={form.control}
                        readonly={
                            erReadonlyForSaksbehandler ||
                            formTilstand === 'LAGRET' ||
                            (!!omgjøringsbehandling &&
                                !erRammebehandlingUnderAktivOmgjøring(omgjøringsbehandling))
                        }
                    />

                    {vurderKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved oppdatering av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{vurderKlage.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {avbrytKlageBehandling.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved avbrytelse av klagebehandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {avbrytKlageBehandling.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {formTilstand === 'REDIGERER' ? (
                        <Button className={styles.lagreKnapp} loading={vurderKlage.isMutating}>
                            Lagre
                        </Button>
                    ) : (
                        <HStack gap="space-16">
                            {!erReadonlyForSaksbehandler &&
                                kanBehandleKlage(klage, omgjøringsbehandling) && (
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

                            {erKlageUnderAktivOmgjøring(klage) ? (
                                <Button
                                    as={Link}
                                    variant="secondary"
                                    href={behandlingUrl({
                                        saksnummer: sak.saksnummer,
                                        id: klage.rammebehandlingId,
                                    })}
                                >
                                    Gå til omgjøringsbehandling
                                </Button>
                            ) : !erReadonlyForSaksbehandler ? (
                                <Button
                                    type="button"
                                    onClick={() => setVilVelgeOmgjøringsbehandlingModal(true)}
                                >
                                    Velg omgjøringsbehandling
                                </Button>
                            ) : null}
                        </HStack>
                    )}

                    {klage.resultat === KlagebehandlingResultat.OMGJØR && (
                        <LocalAlert status="warning">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Omgjøring av vedtak</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                Resultatet av klagebehandlingen er at påklaget vedtak skal omgjøres.
                                Klagebehandlingen blir automatisk ferdigstilt etter
                                omgjøringsbehandlingen er iverksatt.
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {erKlageAvsluttet(klage) && (
                        <Button
                            className={styles.fortsettKnapp}
                            as={Link}
                            href={finnUrlForKlageSteg(klage)}
                        >
                            Fortsett
                        </Button>
                    )}
                </VStack>
            </form>
            {vilAvslutteBehandlingModal && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandlingModal}
                    onClose={() => setVilAvslutteBehandlingModal(false)}
                    tittel={`Avslutt klagebehandling`}
                    tekst={`Er du sikker på at du vil avslutte klagebehandlingen?`}
                    textareaLabel={`Hvorfor avsluttes klagebehandlingen? (obligatorisk)`}
                    onSubmit={(begrunnelse: string) => {
                        avbrytKlageBehandling.trigger({ begrunnelse });
                    }}
                    footer={{
                        isMutating: avbrytKlageBehandling.isMutating,
                        error: avbrytKlageBehandling.error
                            ? avbrytKlageBehandling.error.message
                            : null,
                    }}
                />
            )}
            {vilVelgeOmgjøringsbehandlingModal && (
                <VelgOmgjøringsbehandlingModal
                    sakId={sak.sakId}
                    saksnummer={sak.saksnummer}
                    klageId={klage.id}
                    vedtakOgBehandling={vedtakOgBehandling}
                    søknader={søknader}
                    åpen={vilVelgeOmgjøringsbehandlingModal}
                    onClose={() => setVilVelgeOmgjøringsbehandlingModal(false)}
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
