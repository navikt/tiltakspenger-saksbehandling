import { ReactElement, useState } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import router from 'next/router';
import FormkravForm from '~/components/forms/formkrav/FormkravForm';
import {
    FormkravFormData,
    formkravValidation,
    klageTilFormkravFormData,
} from '~/components/forms/formkrav/FormkravFormUtils';
import { Klagebehandling, KlageId } from '~/types/Klage';
import KlageLayout from '../../layout';
import { KlageSteg } from '../../../../../../utils/KlageLayoutUtils';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';

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
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>('LAGRET');

    const form = useForm<FormkravFormData>({
        defaultValues: klageTilFormkravFormData(klage),
        resolver: formkravValidation,
    });

    const onSubmit = (data: FormkravFormData) => {
        console.log('----------------');
        console.log('Dette er data vi skal oppdatere klage med:', data);
        setFormTilstand('LAGRET');
        console.log('----------------');
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack gap="8" marginInline="16" marginBlock="8" align="start">
                <HStack gap="2">
                    <CheckmarkCircleIcon title="Sjekk ikon" fontSize="1.5rem" color="green" />
                    <Heading size="small">Formkrav</Heading>
                </HStack>
                <FormkravForm
                    readonly={formTilstand === 'LAGRET'}
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
                {formTilstand === 'REDIGERER' ? (
                    <Button>Lagre</Button>
                ) : (
                    <HStack gap="4">
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={() => console.log('Avslutter klage')}
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
    );
};

FormkravKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, klage } = page.props as Props;
    return (
        <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORMKRAV} klage={klage}>
            {page}
        </KlageLayout>
    );
};

export default FormkravKlagePage;
