import { ReactElement, useState } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BodyShort, Button, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import router from 'next/router';
import FormkravForm from '~/components/forms/formkrav/FormkravForm';
import {
    FormkravFormData,
    formkravFormDataTilOppdaterKlageFormkravRequest,
    formkravValidation,
    klageTilFormkravFormData,
} from '~/components/forms/formkrav/FormkravFormUtils';
import { Klagebehandling, KlageId, OppdaterKlageFormkravRequest } from '~/types/Klage';
import KlageLayout, { KlageProvider } from '../../layout';
import { KlageSteg } from '../../../../../../utils/KlageLayoutUtils';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useHentPersonopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
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

const FormkravKlagePage = ({ sak, klage }: Props) => {
    const { personopplysninger } = useHentPersonopplysninger(sak.sakId);
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>('LAGRET');

    const form = useForm<FormkravFormData>({
        defaultValues: klageTilFormkravFormData(klage),
        resolver: formkravValidation,
    });

    const oppdaterFormkrav = useFetchJsonFraApi<Klagebehandling, OppdaterKlageFormkravRequest>(
        `/sak/${sak.sakId}/klage/${klage.id}/formkrav`,
        'PUT',
        {
            onSuccess: (klage) => {
                form.reset(klageTilFormkravFormData(klage!));
                setFormTilstand('LAGRET');
            },
        },
    );

    const avbrytKlageBehandling = useFetchJsonFraApi<Klagebehandling>(
        `/sak/${sak.sakId}/klage/${klage.id}/avbryt`,
        'PATCH',
        {
            onSuccess: () => {
                router.push(`/sak/${sak.saksnummer}`);
            },
        },
    );

    const onSubmit = (data: FormkravFormData) => {
        oppdaterFormkrav.trigger(formkravFormDataTilOppdaterKlageFormkravRequest(data));
    };

    return (
        //vi har formprovider fordi journalpostid komponenten bruker useformcontext. merk at bruken av useformcontext gir oss ikke compile feil dersom endrer på form-interfacet
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="8" marginInline="16" marginBlock="8" align="start">
                    <HStack gap="2">
                        <CheckmarkCircleIcon title="Sjekk ikon" fontSize="1.5rem" color="green" />
                        <Heading size="small">Formkrav</Heading>
                    </HStack>
                    <FormkravForm
                        readonly={formTilstand === 'LAGRET'}
                        fnrFraPersonopplysninger={personopplysninger?.fnr ?? null}
                        control={form.control}
                        vedtakOgBehandling={
                            sak.alleRammevedtak
                                .map((vedtak) => {
                                    const behandling = sak.behandlinger.find(
                                        (behandling) => behandling.id === vedtak.behandlingId,
                                    );
                                    return { vedtak, behandling };
                                })
                                .filter(({ behandling }) => behandling !== undefined) as Array<{
                                vedtak: Rammevedtak;
                                behandling: Rammebehandling;
                            }>
                        }
                    />

                    {oppdaterFormkrav.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved oppdatering av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {oppdaterFormkrav.error.message}
                            </LocalAlert.Content>
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
                        <Button loading={oppdaterFormkrav.isMutating}>Lagre</Button>
                    ) : (
                        <HStack gap="4">
                            {kanBehandleKlage(klage) && (
                                <>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => avbrytKlageBehandling.trigger()}
                                        loading={avbrytKlageBehandling.isMutating}
                                    >
                                        <HStack>
                                            <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                                            <BodyShort>Avslutt</BodyShort>
                                        </HStack>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => setFormTilstand('REDIGERER')}
                                    >
                                        <HStack>
                                            <PencilIcon title="Rediger ikon" fontSize="1.5rem" />
                                            <BodyShort>Rediger</BodyShort>
                                        </HStack>
                                    </Button>
                                </>
                            )}
                            <Button
                                type="button"
                                onClick={() =>
                                    router.push(`/sak/${sak.saksnummer}/klage/${klage.id}/brev`)
                                }
                            >
                                Fortsett
                            </Button>
                        </HStack>
                    )}
                </VStack>
            </form>
        </FormProvider>
    );
};

FormkravKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, klage } = page.props as Props;
    return (
        <KlageProvider klage={klage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORMKRAV} klage={klage}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default FormkravKlagePage;
