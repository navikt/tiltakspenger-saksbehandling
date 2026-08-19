import { useController, useFormContext, UseFormReturn } from 'react-hook-form';
import type { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import type { JaNeiSvar } from '~/lib/søknad/søknadTyper';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { SpørsmålMedPeriodevelger } from '~/lib/søknad/manuell-søknad/SpørsmålMedPeriodevelger';
import { Box, List } from '@navikt/ds-react';
import { SpørsmålMedDatovelger } from '~/lib/søknad/manuell-søknad/SpørsmålMedDatovelger';
import { classNames } from '~/utils/classNames';

import styles from './MottarPengestøtterSpørsmål.module.css';

export const MottarPengestøtterSpørsmål = () => {
    const formContext = useFormContext<ManueltRegistrertSøknad>();
    const { control, resetField } = formContext;

    const spørsmål = useController<ManueltRegistrertSøknad>({
        name: 'svar.mottarAndreUtbetalinger',
        control,
        defaultValue: undefined,
    });

    const nullstillPeriodeFelter = (): void => {
        resetField('svar.alderspensjon.fraOgMed');
        resetField('svar.gjenlevendepensjon.periode');
        resetField('svar.supplerendeStønadAlder.periode');
        resetField('svar.supplerendeStønadFlyktning.periode');
        resetField('svar.trygdOgPensjon.periode');
        resetField('svar.jobbsjansen.periode');
    };

    return (
        <div className={classNames(spørsmål.field.value === 'JA' && styles.blokkUtvidet)}>
            <JaNeiSpørsmål
                name={'svar.mottarAndreUtbetalinger'}
                legend={'Mottar noen av pengestøttene'}
                onChange={(newValue: JaNeiSvar | undefined) => {
                    // Svarer man JA på hovedspørsmålet, så nullstilles alle underspørsmålene i tilfelle man allerede har svart noe annet
                    // om man svarer NEI eller IKKE_BESVART skal alle underliggende spørsmål få samme svar fordi de har implisitt blitt svart på
                    if (newValue !== undefined && newValue !== 'JA') {
                        nullstillPeriodeFelter();
                        manuellSøknadHåndterPengestøtterSvar(formContext, newValue);
                    } else {
                        manuellSøknadHåndterPengestøtterSvar(formContext);
                    }
                }}
                details={
                    <Box marginBlock="space-16" asChild>
                        <List data-aksel-migrated-v8 as="ul">
                            <List.Item>Pengestøtte til gjenlevende ektefelle</List.Item>
                            <List.Item>Alderspensjon</List.Item>
                            <List.Item>Supplerende stønad for personer over 67 år</List.Item>
                            <List.Item>Supplerende stønad for uføre flyktninger</List.Item>
                            <List.Item>
                                Pengestøtte fra andre trygde- eller pensjonsordninger
                            </List.Item>
                            <List.Item>Stønad via Jobbsjansen</List.Item>
                        </List>
                    </Box>
                }
            />
            {spørsmål.field.value === 'JA' && (
                <>
                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.gjenlevendepensjon.svar"
                        periodeFelt="svar.gjenlevendepensjon.periode"
                        spørsmål="Mottar pengestøtte til gjenlevende ektefelle"
                        periodeSpørsmål="I hvilken del av perioden svar bruker pengestøtte til gjenlevende ektefelle?"
                    />

                    <SpørsmålMedDatovelger
                        spørsmålFelt="svar.alderspensjon.svar"
                        datoFelt="svar.alderspensjon.fraOgMed"
                        tittel="Når begynner brukers alderspensjon?"
                        legend="Mottar alderspensjon"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.supplerendeStønadAlder.svar"
                        periodeFelt="svar.supplerendeStønadAlder.periode"
                        spørsmål="Mottar supplerende stønad for personer over 67 år med kort botid i Norge i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for personer over 67 år med kort botid i Norge?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.supplerendeStønadFlyktning.svar"
                        periodeFelt="svar.supplerendeStønadFlyktning.periode"
                        spørsmål="Mottar supplerende stønad for uføre flyktninger i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for uføre flyktninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.trygdOgPensjon.svar"
                        periodeFelt="svar.trygdOgPensjon.periode"
                        spørsmål="Mottar pengestøtte fra andre trygde- eller pensjonsordninger"
                        periodeSpørsmål="I hvilken del av perioden svar bruker pengestøtte fra andre trygde- eller pensjonsordninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.jobbsjansen.svar"
                        periodeFelt="svar.jobbsjansen.periode"
                        spørsmål="Mottar stønad gjennom Jobbsjansen"
                        periodeSpørsmål="I hvilken del av perioden svar bruker stønad gjennom Jobbsjansen?"
                    />
                </>
            )}
        </div>
    );
};

// Oppdaterer alle underspørsmålene til å ha samme svar som hovedspørsmålet, eller nullstiller dem hvis det ikke er noe svar
export const manuellSøknadHåndterPengestøtterSvar = (
    { resetField, setValue }: UseFormReturn<ManueltRegistrertSøknad>,
    svar?: JaNeiSvar,
): void => {
    if (!svar) {
        resetField('svar.gjenlevendepensjon.svar');
        resetField('svar.alderspensjon.svar');
        resetField('svar.supplerendeStønadAlder.svar');
        resetField('svar.supplerendeStønadFlyktning.svar');
        resetField('svar.trygdOgPensjon.svar');
        resetField('svar.jobbsjansen.svar');
    } else {
        setValue('svar.gjenlevendepensjon.svar', svar);
        setValue('svar.alderspensjon.svar', svar);
        setValue('svar.supplerendeStønadAlder.svar', svar);
        setValue('svar.supplerendeStønadFlyktning.svar', svar);
        setValue('svar.trygdOgPensjon.svar', svar);
        setValue('svar.jobbsjansen.svar', svar);
    }
};
