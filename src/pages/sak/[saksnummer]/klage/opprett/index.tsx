import { ReactElement } from 'react';
import KlageLayout from '../layout';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Button, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
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
    formkravFormDataTilOpprettKlageRequest,
    formkravValidation,
} from '~/components/forms/formkrav/FormkravFormUtils';
import { KlageSteg } from '../../../../../utils/KlageLayoutUtils';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import { useHentPersonopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { useOpprettKlage } from '~/api/KlageApi';
import styles from './index.module.css';
import { MeldekortVedtak } from '~/types/meldekort/MeldekortVedtak';
import { MeldekortbehandlingProps } from '~/types/meldekort/Meldekortbehandling';

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
    const { personopplysninger } = useHentPersonopplysninger(sak.sakId);

    const form = useForm<FormkravFormData>({
        defaultValues: {
            journalpostId: '',
            vedtakDetPåklages: '',
            erKlagerPartISaken: null,
            klagesDetPåKonkreteElementer: null,
            erKlagefristOverholdt: null,
            erUnntakForKlagefrist: null,
            erKlagenSignert: null,
            innsendingsdato: null,
            innsendingskilde: '',
        },
        resolver: formkravValidation,
    });

    const opprettKlage = useOpprettKlage({
        sakId: sak.sakId,
        onSuccess: (klagebehandling) => {
            router.push(`/sak/${sak.saksnummer}/klage/${klagebehandling!.id}/formkrav`);
        },
    });

    const onSubmit = (data: FormkravFormData) => {
        opprettKlage.trigger(formkravFormDataTilOpprettKlageRequest(data));
    };

    return (
        //vi har formprovider fordi journalpostid komponenten bruker useformcontext. merk at bruken av useformcontext gir oss ikke compile feil dersom endrer på form-interfacet
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack
                    className={styles.formContainer}
                    gap="space-32"
                    marginBlock="space-32"
                    align="start"
                    maxWidth="35rem"
                >
                    <HStack gap="space-8">
                        <WarningCircleIcon />
                        <Heading size="small">Formkrav</Heading>
                    </HStack>
                    <FormkravForm
                        control={form.control}
                        fnrFraPersonopplysninger={personopplysninger?.fnr ?? null}
                        rammevedtakOgBehandlinger={
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
                        meldekortvedtakOgBehandlinger={
                            sak.meldekortvedtak
                                .map((v) => {
                                    const behandling = sak.meldeperiodeKjeder
                                        .find((k) => k.id === v.kjedeId)
                                        ?.meldekortbehandlinger.find((b) => b.id === v.meldekortId);

                                    return { vedtak: v, behandling };
                                })
                                .filter(({ behandling }) => behandling !== undefined) as Array<{
                                vedtak: MeldekortVedtak;
                                behandling: MeldekortbehandlingProps;
                            }>
                        }
                    />
                    {opprettKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved opprettelse av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{opprettKlage.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <Button loading={opprettKlage.isMutating}>Lagre</Button>
                </VStack>
            </form>
        </FormProvider>
    );
};

OprettKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak } = page.props as Props;
    return (
        <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORMKRAV}>
            {page}
        </KlageLayout>
    );
};

export default OprettKlagePage;
