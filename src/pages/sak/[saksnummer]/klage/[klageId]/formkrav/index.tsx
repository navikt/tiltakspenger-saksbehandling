import { ReactElement } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Button, HStack, VStack } from '@navikt/ds-react';
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
import FormkravInfoDisplay from '~/components/info-display/FormkravInfoDisplay';

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
    const form = useForm<FormkravFormData>({
        defaultValues: klageTilFormkravFormData(klage),
        resolver: formkravValidation,
    });

    const onSubmit = (data: FormkravFormData) => {
        console.log('----------------');
        console.log('Dette er data vi skal oppdatere klage med:', data);
        console.log('----------------');
        router.push(`/sak/${sak.saksnummer}/klage/${klage.id}/brev`);
    };

    return (
        <HStack margin="10" gap="24">
            <FormkravInfoDisplay />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="4">
                    <FormkravForm
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
                    >
                        <Button>Neste</Button>
                    </FormkravForm>
                </VStack>
            </form>
        </HStack>
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
