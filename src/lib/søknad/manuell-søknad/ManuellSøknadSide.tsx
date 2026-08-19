import { useManuellSøknadForm } from '~/lib/søknad/manuell-søknad/ManuellSøknadFormProvider';
import { useSak } from '~/lib/sak/SakContext';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { JournalpostIdForm } from '~/lib/_felles/journalpostId/JournalpostIdForm';
import { ManuellSøknadTypeSelect } from '~/lib/søknad/manuell-søknad/ManuellSøknadTypeSelect';
import { OverførtFraArenaSpørsmål } from '~/lib/søknad/manuell-søknad/OverførtFraArenaSpørsmål';
import {
    Periodevelger,
    ManuellSøknadPeriodeValidationErrors,
} from '~/lib/søknad/manuell-søknad/Periodevelger';
import { VelgTiltak } from '~/lib/søknad/manuell-søknad/tiltak/VelgTiltak';
import { SpørsmålMedPeriodevelger } from '~/lib/søknad/manuell-søknad/SpørsmålMedPeriodevelger';
import { JaNeiSpørsmål } from '~/lib/søknad/manuell-søknad/JaNeiSpørsmål';
import { MottarPengestøtterSpørsmål } from '~/lib/søknad/manuell-søknad/MottarPengestøtterSpørsmål';
import { ManueltRegistrertSøknadBarnetillegg } from '~/lib/søknad/manuell-søknad/barnetillegg/ManueltRegistrertSøknadBarnetillegg';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

import style from './ManuellSøknadSide.module.css';

type Props = {
    fnrFraPersonopplysninger?: string;
};

export const ManuellSøknadSide = ({ fnrFraPersonopplysninger }: Props) => {
    const { sakId } = useSak().sak;
    const { onSubmit, opprettSøknadLaster, opprettSøknadError } = useManuellSøknadForm();

    return (
        <form onSubmit={onSubmit}>
            <div className={style.main}>
                <VStack gap="space-16">
                    <Heading size="medium" level="2" spacing>
                        Manuell registrering av søknad
                    </Heading>

                    <JournalpostIdForm fnrFraPersonopplysninger={fnrFraPersonopplysninger} />

                    <ManuellSøknadTypeSelect />
                    <OverførtFraArenaSpørsmål />

                    <Periodevelger
                        periodeFelt="manueltSattSøknadsperiode"
                        tittel="Hvilken periode er det søkt for?"
                        validate={({ fraOgMed, tilOgMed }) => {
                            const errors: ManuellSøknadPeriodeValidationErrors = {};

                            if (!fraOgMed) {
                                errors.fraOgMed = 'Fra og med er påkrevd.';
                            }

                            if (!tilOgMed) {
                                errors.tilOgMed = 'Til og med er påkrevd.';
                            }

                            if (tilOgMed && fraOgMed && tilOgMed < fraOgMed) {
                                errors.periode = 'Ugyldig periode.';
                            }

                            return errors;
                        }}
                    />

                    <VelgTiltak
                        sakId={sakId}
                        spørsmålName="svar.harSøktPåTiltak.svar"
                        legend="Har søkt på tiltak?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.kvp.svar"
                        periodeFelt="svar.kvp.periode"
                        spørsmål="Mottar kvalifiseringsstønad"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.intro.svar"
                        periodeFelt="svar.intro.periode"
                        spørsmål="Mottar introduksjonsstønad"
                    />

                    <JaNeiSpørsmål name="svar.etterlønn.svar" legend="Mottar etterlønn" />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.sykepenger.svar"
                        periodeFelt="svar.sykepenger.periode"
                        periodeSpørsmål="I hvilken del av perioden var bruker sykemeldt?"
                        spørsmål="Har nylig mottatt sykepenger og er fortsatt sykemeldt"
                    />

                    <MottarPengestøtterSpørsmål />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.institusjon.svar"
                        periodeFelt="svar.institusjon.periode"
                        spørsmål="Bor bruker i en institusjon med gratis opphold, mat og drikke i perioden "
                        periodeSpørsmål="I hvilken del av perioden bor brukeren på institusjon med gratis opphold, mat og drikke?"
                    />

                    <ManueltRegistrertSøknadBarnetillegg
                        sakId={sakId}
                        name="svar.harSøktOmBarnetillegg.svar"
                        legend="Har bruker søkt barnetillegg?"
                    />

                    {opprettSøknadError && (
                        <Infokort variant={'feil'}>
                            Noe gikk galt ved registrering av papirsøknad. Vennligst prøv igjen litt
                            senere.
                        </Infokort>
                    )}

                    <HStack gap="space-16">
                        <Button variant="secondary" type="reset">
                            Avbryt
                        </Button>
                        <Button type="submit" loading={opprettSøknadLaster}>
                            Start behandling
                        </Button>
                    </HStack>
                </VStack>
            </div>
        </form>
    );
};
