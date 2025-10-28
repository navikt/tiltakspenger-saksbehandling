import styles from './PapirsøknadPage.module.css';
import { Alert, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
import { Datovelger } from '~/components/datovelger/Datovelger';
import React, { useEffect } from 'react';
import { Periodevelger } from '~/components/papirsøknad/Periodevelger';
import { dateTilISOTekst } from '~/utils/date';
import { VelgTiltak } from '~/components/papirsøknad/tiltak/VelgTiltak';
import { Barnetillegg } from '~/components/papirsøknad/barnetillegg/Barnetillegg';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { useOpprettPapirsøknad } from '~/components/saksoversikt/papirsøknad/useOpprettPapirsøknad';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { useHentPersonopplysninger } from '~/components/personaliaheader/useHentPersonopplysninger';

interface Props {
    sak: SakProps;
}

const PapirsøknadPage = (props: Props) => {
    const { papirsøknadToggle } = useFeatureToggles();
    const { personopplysninger } = useHentPersonopplysninger(props.sak.sakId);
    const formContext = useForm<Papirsøknad>({
        defaultValues: defaultPapirsøknadFormValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, control, setValue } = formContext;

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
        if (!papirsøknadToggle) return;
        if (!personopplysninger) return;

        console.log('data', data);
        opprettPapirsøknad(data).then((behandling) => {
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
                    kanSendeInnHelgForMeldekort={props.sak.kanSendeInnHelgForMeldekort}
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.main}>
                        <VStack gap="4">
                            <Heading size="medium" level="2" spacing>
                                Registrere papirsøknad
                            </Heading>

                            <Controller
                                name="journalpostId"
                                control={control}
                                rules={{ required: 'JournalpostId er påkrevd' }}
                                render={({ field, fieldState }) => (
                                    <div className={styles.blokk}>
                                        <TextField
                                            label={'JournalpostId'}
                                            value={field.value ?? ''}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            error={fieldState.error?.message}
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="kravDato"
                                control={control}
                                rules={{ required: 'Kravdato er påkrevd' }}
                                render={({ field, fieldState }) => (
                                    <div className={styles.blokk}>
                                        <Datovelger
                                            label="Kravdato"
                                            selected={field.value || undefined}
                                            onDateChange={(date) =>
                                                field.onChange(date ? dateTilISOTekst(date) : '')
                                            }
                                            error={fieldState.error?.message}
                                        />
                                    </div>
                                )}
                            />

                            <Periodevelger
                                name="manueltSattSøknadsperiode"
                                tittel="Periode"
                                rules={{
                                    fraOgMed: { required: 'Fra og med er påkrevd' },
                                    tilOgMed: { required: 'Til og med er påkrevd' },
                                }}
                            />

                            <VelgTiltak
                                sakId={props.sak.sakId}
                                spørsmålName="svar.harTiltak"
                                legend="Deltar i arbeidmarkedtiltak som gir rett til tiltakspenger?"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.kvalifiseringsprogram.svar"
                                periodeName="svar.kvalifiseringsprogram.periode"
                                spørsmål="Mottar kvalifiseringsstønad"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.introduksjonsprogram.svar"
                                periodeName="svar.introduksjonsprogram.periode"
                                spørsmål="Mottar introduksjonsstønad"
                            />

                            <JaNeiSpørsmål name="svar.etterlønn.svar" legend="Mottar etterlønn" />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.sykepenger.svar"
                                periodeName="svar.sykepenger.periode"
                                periodeSpørsmål="I hvilken del av perioden var bruker sykemeldt?"
                                spørsmål="Har nylig mottatt sykepenger og er fortsatt sykemeldt"
                            />

                            <MottarPengestøtterSpørsmål
                                name="svar.mottarAndreUtbetalinger"
                                legend="Mottar noen av pengestøttene"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.institusjonsopphold.svar"
                                periodeName="svar.institusjonsopphold.periode"
                                spørsmål="Bor bruker i en institusjon med gratis opphold, mat og drikke i perioden "
                                periodeSpørsmål="I hvilken del av perioden bor brukeren på institusjon med gratis opphold, mat og drikke?"
                            />

                            <Barnetillegg
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
