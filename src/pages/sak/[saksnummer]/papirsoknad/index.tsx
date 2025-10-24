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
import React from 'react';
import { Periodevelger } from '~/components/papirsøknad/Periodevelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import { VelgTiltak } from '~/components/papirsøknad/tiltak/VelgTiltak';
import { Barnetillegg } from '~/components/papirsøknad/barnetillegg/Barnetillegg';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { useOpprettPapirsøknad } from '~/components/saksoversikt/papirsøknad/useOpprettPapirsøknad';

interface Props {
    sak: SakProps;
}

const PapirsøknadPage = (props: Props) => {
    const { papirsøknadToggle } = useFeatureToggles();
    const formContext = useForm<Papirsøknad>({
        defaultValues: defaultPapirsøknadFormValues,
        mode: 'onSubmit',
    });

    const { handleSubmit, control } = formContext;

    const { opprettPapirsøknad, opprettPapirsøknadLaster, opprettPapirsøknadError } =
        useOpprettPapirsøknad(props.sak.sakId);

    const onSubmit = (data: Papirsøknad) => {
        if (!papirsøknadToggle) return;
        console.log('form data', data);
        opprettPapirsøknad(data);
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
                                render={({ field }) => (
                                    <div className={styles.blokk}>
                                        <TextField
                                            label={'JournalpostId'}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="kravDato"
                                control={control}
                                render={({ field }) => (
                                    <div className={styles.blokk}>
                                        <Datovelger
                                            name="kravDato"
                                            label="Kravdato"
                                            value={
                                                field.value
                                                    ? datoTilDatoInputText(field.value)
                                                    : undefined
                                            }
                                            onChange={field.onChange}
                                            onDateChange={(date) => {
                                                if (!date) {
                                                    field.onChange(undefined);
                                                    return;
                                                }
                                                field.onChange(dateTilISOTekst(date));
                                            }}
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="manueltSattSøknadsperiode"
                                control={control}
                                render={({ field }) => (
                                    <Periodevelger
                                        name={'manueltSattSøknadsperiode'}
                                        tittel={'Periode'}
                                        value={field.value}
                                    />
                                )}
                            />

                            <VelgTiltak
                                sakId={props.sak.sakId}
                                spørsmålName="svar.harTiltak"
                                legend="Deltar i arbeidmarkedtiltak som gir rett til tiltakspenger?"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.kvalifiseringsprogram.deltar"
                                periodeName="svar.kvalifiseringsprogram.periode"
                                spørsmål="Mottar kvalifiseringsstønad"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.introduksjonsprogram.deltar"
                                periodeName="svar.introduksjonsprogram.periode"
                                spørsmål="Mottar introduksjonsstønad"
                            />

                            <JaNeiSpørsmål name="svar.etterlønn.mottar" legend="Mottar etterlønn" />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.sykepenger.mottar"
                                periodeName="svar.sykepenger.periode"
                                periodeSpørsmål="I hvilken del av perioden var bruker sykemeldt?"
                                spørsmål="Har nylig mottatt sykepenger og er fortsatt sykemeldt"
                            />

                            <MottarPengestøtterSpørsmål
                                name="svar.mottarAndreUtbetalinger"
                                legend="Mottar noen av pengestøttene"
                            />

                            <SpørsmålMedPeriodevelger
                                spørsmålName="svar.institusjonsopphold.borPåInstitusjon"
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
