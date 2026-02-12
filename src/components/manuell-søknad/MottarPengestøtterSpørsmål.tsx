import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type {
    JaNeiSvar,
    ManueltRegistrertSøknad,
} from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';

import styles from './MottarPengestøtterSpørsmål.module.css';
import { SpørsmålMedPeriodevelger } from '~/components/manuell-søknad/SpørsmålMedPeriodevelger';
import { Box, List } from '@navikt/ds-react';
import { SpørsmålMedDatovelger } from '~/components/manuell-søknad/SpørsmålMedDatovelger';

type Props = {
    name: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
    tittel?: string;
};

export const MottarPengestøtterSpørsmål = ({ name, legend }: Props) => {
    const { control, setValue, resetField } = useFormContext<ManueltRegistrertSøknad>();

    const spørsmål = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    const nullstillPeriodeFelter = (): void => {
        resetField('svar.gjenlevendepensjon.fraOgMed');
        resetField('svar.gjenlevendepensjon.tilOgMed');
        resetField('svar.alderspensjon.fraOgMed');
        resetField('svar.supplerendeStønadAlder.fraOgMed');
        resetField('svar.supplerendeStønadAlder.tilOgMed');
        resetField('svar.supplerendeStønadFlyktning.fraOgMed');
        resetField('svar.supplerendeStønadFlyktning.tilOgMed');
        resetField('svar.trygdOgPensjon.fraOgMed');
        resetField('svar.trygdOgPensjon.tilOgMed');
        resetField('svar.jobbsjansen.fraOgMed');
        resetField('svar.jobbsjansen.tilOgMed');
    };

    // Svarer man JA på hovedspørsmålet, så nullstilles alle underspørsmålene i tilfelle man allerede har svart noe annet
    // om man svarer NEI eller IKKE_BESVART skal alle underliggende spørsmål få samme svar fordi de har implisitt blitt svart på
    const settFelter = (svar: JaNeiSvar | undefined): void => {
        if (svar === undefined) {
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

    return (
        <div className={spørsmål.field.value === 'JA' ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={name}
                legend={legend}
                onChange={(newValue: JaNeiSvar | undefined) => {
                    if (newValue !== undefined && newValue !== 'JA') {
                        nullstillPeriodeFelter();
                        settFelter(newValue);
                    } else {
                        settFelter(undefined);
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
                        fraOgMedFelt="svar.gjenlevendepensjon.fraOgMed"
                        tilOgMedFelt="svar.gjenlevendepensjon.tilOgMed"
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
                        fraOgMedFelt="svar.supplerendeStønadAlder.fraOgMed"
                        tilOgMedFelt="svar.supplerendeStønadAlder.tilOgMed"
                        spørsmål="Mottar supplerende stønad for personer over 67 år med kort botid i Norge i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for personer over 67 år med kort botid i Norge?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.supplerendeStønadFlyktning.svar"
                        fraOgMedFelt="svar.supplerendeStønadFlyktning.fraOgMed"
                        tilOgMedFelt="svar.supplerendeStønadFlyktning.tilOgMed"
                        spørsmål="Mottar supplerende stønad for uføre flyktninger i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for uføre flyktninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.trygdOgPensjon.svar"
                        fraOgMedFelt="svar.trygdOgPensjon.fraOgMed"
                        tilOgMedFelt="svar.trygdOgPensjon.tilOgMed"
                        spørsmål="Mottar pengestøtte fra andre trygde- eller pensjonsordninger"
                        periodeSpørsmål="I hvilken del av perioden svar bruker pengestøtte fra andre trygde- eller pensjonsordninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålFelt="svar.jobbsjansen.svar"
                        fraOgMedFelt="svar.jobbsjansen.fraOgMed"
                        tilOgMedFelt="svar.jobbsjansen.tilOgMed"
                        spørsmål="Mottar stønad gjennom Jobbsjansen"
                        periodeSpørsmål="I hvilken del av perioden svar bruker stønad gjennom Jobbsjansen?"
                    />
                </>
            )}
        </div>
    );
};
