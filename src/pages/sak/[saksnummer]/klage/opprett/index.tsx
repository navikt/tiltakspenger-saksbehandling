import { ReactElement } from 'react';
import KlageLayout from '../layout';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Button, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
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
import { KlageSteg } from '../KlageLayoutUtils';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import OppsummeringAvJournalførtKlage from '~/components/oppsummeringer/oppsummeringAvJournalførtKlage/OppsummeringAvJournalførtKlage';

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
                router.push(`/sak/${sak.saksnummer}/klage/${klagebehandling!.id}/formkrav`);
            },
        },
    );

    const onSubmit = (data: FormkravFormData) => {
        opprettKlage.trigger(formkravFormDataTilOpprettKlageRequest(data));
    };

    return (
        <HStack margin="10" gap="24">
            <FormkravInfoDisplay />
            <VStack>
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
                            {opprettKlage.error && (
                                <LocalAlert status="error">
                                    <LocalAlert.Header>
                                        <LocalAlert.Title>
                                            Feil ved oppretting av klage
                                        </LocalAlert.Title>
                                    </LocalAlert.Header>
                                    <LocalAlert.Content>
                                        {opprettKlage.error.message}
                                    </LocalAlert.Content>
                                </LocalAlert>
                            )}
                            <Button>Lagre</Button>
                        </FormkravForm>
                    </VStack>
                </form>
            </VStack>
        </HStack>
    );
};

const FormkravInfoDisplay = () => {
    return (
        <VStack gap="3">
            <HStack gap="2">
                <WarningCircleIcon />
                <Heading size="small">Formkrav</Heading>
            </HStack>
            <OppsummeringAvJournalførtKlage journalføringsdato={null} />
        </VStack>
    );
};

OprettKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak } = page.props as Props;
    return (
        <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORMKRAV} klage={null}>
            {page}
        </KlageLayout>
    );
};

export default OprettKlagePage;
