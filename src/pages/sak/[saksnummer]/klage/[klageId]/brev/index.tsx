import { ReactElement, useState } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BodyShort, Button, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import {
    ForhåndsvisBrevKlageRequest,
    Klagebehandling,
    KlageId,
    LagreBrevtekstKlageRequest,
} from '~/types/Klage';
import KlageLayout from '../../layout';
import Image from 'next/image';
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
import { useFetchBlobFraApi, useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { kanBehandleKlage } from '~/utils/klageUtils';

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

const BrevKlagePage = ({ sak, klage }: Props) => {
    const [harSendt, setHarSendt] = useState<boolean>(false);

    const form = useForm<BrevFormData>({
        defaultValues: klageTilBrevFormData(klage),
        resolver: brevFormValidation,
    });

    const forhåndsvis = useFetchBlobFraApi<ForhåndsvisBrevKlageRequest>(
        `/sak/${sak.sakId}/klage/${klage.id}/forhandsvis`,
        'POST',
        {
            onSuccess: (blob) => {
                if (blob) {
                    window.open(URL.createObjectURL(blob));
                }
            },
        },
    );

    const lagreBrev = useFetchJsonFraApi<Klagebehandling, LagreBrevtekstKlageRequest>(
        `/sak/${sak.sakId}/klage/${klage.id}/brevtekst`,
        'PUT',
        {
            onSuccess: (klage) => {
                form.reset(klageTilBrevFormData(klage!));
            },
        },
    );

    const iverksett = useFetchJsonFraApi<Klagebehandling>(
        `/sak/${sak.sakId}/klage/${klage.id}/iverksett`,
        'PATCH',
        {
            onSuccess: (oppdatertKlage) => {
                console.log('Klage iverksatt:', oppdatertKlage);
                setHarSendt(true);
            },
        },
    );

    const onSubmit = () => {
        iverksett.trigger();
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack>
                <HStack gap="2" marginInline="16" marginBlock="8" align="start">
                    {form.formState.isDirty ? (
                        <WarningCircleIcon />
                    ) : (
                        <CheckmarkCircleIcon fontSize="1.5rem" color="green" />
                    )}
                    <Heading size="small">Brev</Heading>
                </HStack>

                <BrevForm
                    control={form.control}
                    className={styles.brevformContainer}
                    readOnly={klage.erAvbrutt}
                />

                <VStack gap="8" marginInline="16" marginBlock="8" align="start">
                    <VStack gap="4" align="start">
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
                        <HStack gap="4">
                            {kanBehandleKlage(klage) && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    loading={lagreBrev.isMutating}
                                    onClick={() => {
                                        forhåndsvis.reset();

                                        lagreBrev.trigger(
                                            brevFormDataTilLagreBrevtekstKlageRequest(
                                                form.getValues(),
                                            ),
                                        );
                                    }}
                                >
                                    Lagre
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                loading={forhåndsvis.isMutating}
                                onClick={() => {
                                    lagreBrev.reset();
                                    forhåndsvis.trigger(
                                        brevFormDataTilForhåndsvisBrevKlageRequest(
                                            form.getValues(),
                                        ),
                                    );
                                }}
                            >
                                <HStack gap="1">
                                    <EnvelopeOpenIcon title="Åpent brev ikon" fontSize="1.5rem" />
                                    <BodyShort>Forhåndsvis brev</BodyShort>
                                </HStack>
                            </Button>
                        </HStack>
                    </VStack>
                    {kanBehandleKlage(klage) && (
                        <Button disabled={!klage.kanIverksette || form.formState.isDirty}>
                            Ferdigstill behandling og send brev
                        </Button>
                    )}

                    {harSendt && (
                        <Image
                            src="/giphy.gif"
                            alt="hund som gir deg et brev"
                            aria-hidden
                            width="400"
                            height="400"
                            priority
                        />
                    )}
                </VStack>
            </VStack>
        </form>
    );
};

BrevKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, klage } = page.props as Props;
    return (
        <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.BREV} klage={klage}>
            {page}
        </KlageLayout>
    );
};

export default BrevKlagePage;
