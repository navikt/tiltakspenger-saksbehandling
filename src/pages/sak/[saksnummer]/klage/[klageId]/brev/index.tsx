import { ReactElement } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BodyShort, Button, Heading, HStack, Label, LocalAlert, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import { Klagebehandling, KlagebehandlingResultat, KlageId } from '~/types/Klage';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { KlageSteg } from '../../../../../../utils/KlageLayoutUtils';
import { CheckmarkCircleIcon, EnvelopeOpenIcon } from '@navikt/aksel-icons';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import {
    BrevFormData,
    brevFormDataTilForhåndsvisBrevKlageRequest,
    brevFormDataTilLagreBrevtekstKlageRequest,
    brevFormValidation,
    klageTilBrevFormData,
} from '~/components/forms/brev/BrevFormUtils';
import BrevForm from '~/components/forms/brev/BrevForm';
import styles from './index.module.css';

import {
    erKlageOpprettholdelse,
    erKlageOpprettholdtEllerEtter,
    kanBehandleKlage,
} from '~/utils/klageUtils';
import router from 'next/router';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import {
    useForhåndsvisKlagebrev,
    useIverksettKlage,
    useLagreKlagebrev,
    useOpprettholdKlage,
} from '~/api/KlageApi';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Nullable } from '~/types/UtilTypes';
import Link from 'next/link';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    påklagetVedtak: Nullable<Rammevedtak>;
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

    const påklagetVedtak =
        sak.alleRammevedtak.find((vedtak) => vedtak.id === initialKlage.vedtakDetKlagesPå) ?? null;

    return { props: { sak, initialKlage, påklagetVedtak } };
});

const BrevKlagePage = ({ sak, påklagetVedtak }: Props) => {
    const { klage, setKlage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();

    const erReadonlyForSaksbehandler = innloggetSaksbehandler.navIdent !== klage.saksbehandler;

    const form = useForm<BrevFormData>({
        defaultValues: klageTilBrevFormData(klage, påklagetVedtak),
        resolver: brevFormValidation,
    });

    const forhåndsvis = useForhåndsvisKlagebrev({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (blob) => {
            if (blob) {
                window.open(URL.createObjectURL(blob));
            }
        },
    });

    const lagreBrev = useLagreKlagebrev({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (klage) => {
            form.reset(klageTilBrevFormData(klage!, påklagetVedtak));
            setKlage(klage!);
        },
    });

    const iverksett = useIverksettKlage({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (oppdatertKlage) => {
            setKlage(oppdatertKlage!);
            router.push(`/sak/${sak.saksnummer}`);
        },
    });

    const oppretthold = useOpprettholdKlage({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (oppdatertKlage) => {
            setKlage(oppdatertKlage!);
            router.push(`/sak/${sak.saksnummer}`);
        },
    });

    const onSubmit = () => {
        if (klage.resultat === KlagebehandlingResultat.OPPRETTHOLDT) {
            oppretthold.trigger();
        } else {
            iverksett.trigger();
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack>
                <VStack marginInline="space-64" marginBlock="space-32" gap="space-16">
                    <HStack gap="space-8" align="start">
                        {form.formState.isDirty ? (
                            <WarningCircleIcon />
                        ) : (
                            <CheckmarkCircleIcon fontSize="1.5rem" color="green" />
                        )}
                        <Heading size="small">Brev</Heading>
                    </HStack>
                    {klage.resultat === 'OPPRETTHOLDT' && (
                        <Label>
                            Innstilling til Nav klageinstans (kommer med i brev til bruker)
                        </Label>
                    )}
                </VStack>

                <BrevForm
                    control={form.control}
                    className={styles.brevformContainer}
                    readOnly={erReadonlyForSaksbehandler || !kanBehandleKlage(klage, null)}
                />

                <VStack gap="space-32" marginInline="space-64" marginBlock="space-32" align="start">
                    <VStack gap="space-16" align="start">
                        {forhåndsvis.error && (
                            <LocalAlert status="error">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        Feil ved forhåndsvisning av brev
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>{forhåndsvis.error.message}</LocalAlert.Content>
                            </LocalAlert>
                        )}
                        {lagreBrev.error && (
                            <LocalAlert status="error">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>Feil ved lagring av brev</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>{lagreBrev.error.message}</LocalAlert.Content>
                            </LocalAlert>
                        )}
                        <HStack gap="space-16">
                            {!erReadonlyForSaksbehandler && kanBehandleKlage(klage, null) && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    loading={lagreBrev.isMutating}
                                    onClick={() => {
                                        forhåndsvis.reset();
                                        form.trigger().then((isValid) => {
                                            if (isValid) {
                                                lagreBrev.trigger(
                                                    brevFormDataTilLagreBrevtekstKlageRequest(
                                                        form.getValues(),
                                                    ),
                                                );
                                            }
                                        });
                                    }}
                                >
                                    Lagre
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                loading={forhåndsvis.isMutating}
                                icon={
                                    <EnvelopeOpenIcon title="Åpent brev ikon" fontSize="1.5rem" />
                                }
                                iconPosition="left"
                                onClick={() => {
                                    lagreBrev.reset();
                                    forhåndsvis.trigger(
                                        brevFormDataTilForhåndsvisBrevKlageRequest(
                                            form.getValues(),
                                        ),
                                    );
                                }}
                            >
                                Forhåndsvis brev
                            </Button>

                            {erKlageOpprettholdelse(klage) &&
                                erKlageOpprettholdtEllerEtter(klage.status) && (
                                    <Button
                                        as={Link}
                                        href={`/sak/${sak.saksnummer}/klage/${klage.id}/resultat`}
                                    >
                                        Fortsett
                                    </Button>
                                )}
                        </HStack>
                    </VStack>
                    {!erReadonlyForSaksbehandler && kanBehandleKlage(klage, null) && (
                        <Button
                            disabled={
                                (klage.resultat === KlagebehandlingResultat.AVVIST &&
                                    !klage.kanIverksetteVedtak) ||
                                (klage.resultat === KlagebehandlingResultat.OPPRETTHOLDT &&
                                    !klage.kanIverksetteOpprettholdelse) ||
                                form.formState.isDirty
                            }
                        >
                            Ferdigstill behandling og send brev
                        </Button>
                    )}
                </VStack>
            </VStack>
        </form>
    );
};

BrevKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage: klage } = page.props as Props;
    return (
        <KlageProvider initialKlage={klage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.BREV}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default BrevKlagePage;
