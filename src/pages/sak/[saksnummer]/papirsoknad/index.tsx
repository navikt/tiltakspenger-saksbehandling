import styles from './PapirsøknadPage.module.css';
import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { SakProvider } from '~/context/sak/SakContext';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { SpørsmålMedPeriodevelger } from '~/components/papirsøknad/SpørsmålMedPeriodevelger';
import { PersonaliaHeader } from '~/components/personaliaheader/PersonaliaHeader';
import defaultPapirsøknadFormValues, {
    Papirsøknad,
} from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { MottarPengestøtterSpørsmål } from '~/components/papirsøknad/MottarPengestøtterSpørsmål';
import React, { useEffect } from 'react';
import { Periodevelger } from '~/components/papirsøknad/Periodevelger';
import { VelgTiltak } from '~/components/papirsøknad/tiltak/VelgTiltak';
import { PapirsøknadBarnetillegg } from '~/components/papirsøknad/barnetillegg/PapirsøknadBarnetillegg';
import { useOpprettPapirsøknad } from '~/components/personoversikt/papirsøknad/useOpprettPapirsøknad';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { useHentPersonopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';
import { JournalpostId } from '~/components/papirsøknad/journalpostId/JournalpostId';

interface Props {
    sak: SakProps;
}

const PapirsøknadPage = (props: Props) => {
    const { personopplysninger } = useHentPersonopplysninger(props.sak.sakId);
    const formContext = useForm<Papirsøknad>({
        defaultValues: defaultPapirsøknadFormValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, setValue } = formContext;

    useEffect(() => {
        if (!personopplysninger) return;
        setValue('personopplysninger', {
            fornavn: personopplysninger.fornavn,
            etternavn: personopplysninger.etternavn,
            ident: personopplysninger.fnr,
        });
    }, [personopplysninger, setValue]);

    const { opprettPapirsøknad, opprettPapirsøknadLaster, opprettPapirsøknadError } =
        useOpprettPapirsøknad(props.sak.saksnummer);

    const onSubmit = (data: Papirsøknad) => {
        if (!personopplysninger) return;

        const antallVedlegg = (data.svar.barnetilleggManuelle || []).reduce(
            (sum, b) => sum + (b.manueltRegistrertBarnAntallVedlegg ?? 0),
            0,
        );

        opprettPapirsøknad({ ...data, antallVedlegg }).then((behandling) => {
            if (behandling) {
                router.push(behandlingUrl(behandling));
            }
        });
    };

    return (
        <SakProvider sak={props.sak}>
            <FormProvider {...formContext}>
                <PersonaliaHeader
                    sakId={props.sak.sakId}
                    saksnummer={props.sak.saksnummer}
                    visTilbakeKnapp={true}
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.main}>
                        <VStack gap="4">
                            <Heading size="medium" level="2" spacing>
                                Registrere papirsøknad
                            </Heading>

                            <JournalpostId />

                            <Periodevelger
                                fraOgMedFelt="manueltSattSøknadsperiode.fraOgMed"
                                tilOgMedFelt="manueltSattSøknadsperiode.tilOgMed"
                                tittel="Hvilken periode er det søkt for?"
                                rules={{
                                    fraOgMed: { required: 'Fra og med er påkrevd' },
                                    tilOgMed: { required: 'Til og med er påkrevd' },
                                    validateRange: (fraOgMed, tilOgMed) => {
                                        if (!fraOgMed || !tilOgMed) return true;
                                        return (
                                            new Date(tilOgMed) >= new Date(fraOgMed) ||
                                            'Ugyldig periode.'
                                        );
                                    },
                                }}
                            />

                            <VelgTiltak
                                sakId={props.sak.sakId}
                                spørsmålName="svar.harTiltak"
                                legend="Har søkt på tiltak?"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålFelt="svar.kvp.svar"
                                fraOgMedFelt="svar.kvp.fraOgMed"
                                tilOgMedFelt="svar.kvp.tilOgMed"
                                spørsmål="Mottar kvalifiseringsstønad"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålFelt="svar.intro.svar"
                                fraOgMedFelt="svar.intro.fraOgMed"
                                tilOgMedFelt="svar.intro.tilOgMed"
                                spørsmål="Mottar introduksjonsstønad"
                            />

                            <JaNeiSpørsmål name="svar.etterlønn.svar" legend="Mottar etterlønn" />

                            <SpørsmålMedPeriodevelger
                                spørsmålFelt="svar.sykepenger.svar"
                                fraOgMedFelt="svar.sykepenger.fraOgMed"
                                tilOgMedFelt="svar.sykepenger.tilOgMed"
                                periodeSpørsmål="I hvilken del av perioden var bruker sykemeldt?"
                                spørsmål="Har nylig mottatt sykepenger og er fortsatt sykemeldt"
                            />

                            <MottarPengestøtterSpørsmål
                                name="svar.mottarAndreUtbetalinger"
                                legend="Mottar noen av pengestøttene"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålFelt="svar.institusjon.svar"
                                fraOgMedFelt="svar.institusjon.fraOgMed"
                                tilOgMedFelt="svar.institusjon.tilOgMed"
                                spørsmål="Bor bruker i en institusjon med gratis opphold, mat og drikke i perioden "
                                periodeSpørsmål="I hvilken del av perioden bor brukeren på institusjon med gratis opphold, mat og drikke?"
                            />

                            <PapirsøknadBarnetillegg
                                sakId={props.sak.sakId}
                                name="svar.harSøktOmBarnetillegg"
                                legend="Har bruker søkt barnetillegg?"
                            />

                            {opprettPapirsøknadError && (
                                <Alert variant="error">
                                    Noe gikk galt ved registrering av papirsøknad. Vennligst prøv
                                    igjen litt senere.
                                </Alert>
                            )}

                            <HStack gap="4">
                                <Button variant="secondary" type="reset">
                                    Avbryt
                                </Button>
                                <Button type="submit" loading={opprettPapirsøknadLaster}>
                                    Start behandling
                                </Button>
                            </HStack>
                        </VStack>
                    </div>
                </form>
            </FormProvider>
        </SakProvider>
    );
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const sak = await fetchSak(context.req, context.params!.saksnummer as string);

    if (!sak) {
        return {
            notFound: true,
        };
    }

    return { props: { sak } satisfies Props };
});

export default PapirsøknadPage;
