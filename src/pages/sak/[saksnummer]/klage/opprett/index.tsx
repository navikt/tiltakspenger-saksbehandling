import { ReactElement } from 'react';
import KlageLayout from '../layout';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Rammebehandling } from '~/types/Rammebehandling';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/types/Sak';
import router from 'next/router';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import FormkravForm from '~/components/forms/formkrav/FormkravForm';
import {
    FormkravFormData,
    formkravFormDataTilOpprettKlageRequest,
    formkravValidation,
} from '~/components/forms/formkrav/FormkravFormUtils';
import { Klagebehandling, OpprettKlageRequest } from '~/types/Klage';

type Props = {
    sak: SakProps;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    return { props: { sak } };
});

const OprettKlagePage = ({ sak }: Props) => {
    const form = useForm<FormkravFormData>({
        defaultValues: {
            journalpostId: '',
            vedtakDetPåklages: '',
            erKlagerPartISaken: null,
            klagesDetPåKonkreteElementer: null,
            erKlagefristOverholdt: null,
            erKlagenSignert: null,
        },
        resolver: formkravValidation,
    });

    const opprettKlage = useFetchJsonFraApi<Klagebehandling, OpprettKlageRequest>(
        `/sak/${sak.sakId}/klage`,
        'POST',
        {
            onSuccess: (klagebehandling) => {
                console.log('Klage opprettet:', klagebehandling);
                router.push(`/sak/${sak.saksnummer}/klage/${klagebehandling!.id}/brev`);
            },
        },
    );

    const onSubmit = (data: FormkravFormData) => {
        opprettKlage.trigger(formkravFormDataTilOpprettKlageRequest(data));
    };

    return (
        <VStack>
            <Heading size="medium">Formkrav</Heading>

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
                    />

                    <HStack gap="4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.push(`/sak/${sak.saksnummer}`)}
                        >
                            Tilbake
                        </Button>
                        <Button>Neste</Button>
                    </HStack>
                </VStack>
            </form>
        </VStack>
    );
};

OprettKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak } = page.props as Props;
    return <KlageLayout saksnummer={sak.saksnummer}>{page}</KlageLayout>;
};

export default OprettKlagePage;
