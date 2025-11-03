import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { JaNeiSvar, Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';

import styles from './Spørsmål.module.css';
import { SpørsmålMedPeriodevelger } from '~/components/papirsøknad/SpørsmålMedPeriodevelger';
import { List } from '@navikt/ds-react';
import { SpørsmålMedDatovelger } from '~/components/papirsøknad/SpørsmålMedDatovelger';

type Props = {
    name: FieldPath<Papirsøknad>;
    legend: string;
    tittel?: string;
};

export const MottarPengestøtterSpørsmål = ({ name, legend }: Props) => {
    const { control, setValue, resetField } = useFormContext<Papirsøknad>();

    const spørsmål = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    const nullstillPeriodeFelter = (): void => {
        resetField('svar.gjenlevendepensjon.periode');
        resetField('svar.alderspensjon.fraOgMed');
        resetField('svar.supplerendeStønadAlder.periode');
        resetField('svar.supplerendeStønadFlyktning.periode');
        resetField('svar.trygdOgPensjon.periode');
        resetField('svar.jobbsjansen.periode');
    };

    // Svarer man JA på hovedspørsmålet, så nullstilles alle underspørsmålene i tilfelle man allerede har svart noe annet
    // om man svarer NEI eller IKKE_BESVART skal alle underliggende spørsmål få samme svar fordi de har implisitt blitt svart på
    const settFelter = (svar: JaNeiSvar | undefined): void => {
        if (svar === undefined) {
            resetField('svar.gjenlevendepensjon.svar');
            resetField('svar.alderspensjon.svar');
            resetField('svar.alderspensjon.fraOgMed');
            resetField('svar.supplerendeStønadAlder.svar');
            resetField('svar.supplerendeStønadFlyktning.svar');
            resetField('svar.trygdOgPensjon.svar');
            resetField('svar.jobbsjansen.svar');
        } else {
            setValue('svar.gjenlevendepensjon.svar', svar);
            setValue('svar.alderspensjon.svar', svar);
            setValue('svar.alderspensjon.fraOgMed', svar);
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
                    <List as="ul">
                        <List.Item>Pengestøtte til gjenlevende ektefelle</List.Item>
                        <List.Item>Alderspensjon</List.Item>
                        <List.Item>Supplerende stønad for personer over 67 år</List.Item>
                        <List.Item>Supplerende stønad for uføre flyktninger</List.Item>
                        <List.Item>Pengestøtte fra andre trygde- eller pensjonsordninger</List.Item>
                        <List.Item>Stønad via Jobbsjansen</List.Item>
                    </List>
                }
            />
            {spørsmål.field.value === 'JA' && (
                <>
                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.gjenlevendepensjon.svar"
                        periodeName="svar.gjenlevendepensjon.periode"
                        spørsmål="Mottar pengestøtte til gjenlevende ektefelle"
                        periodeSpørsmål="I hvilken del av perioden svar bruker pengestøtte til gjenlevende ektefelle?"
                    />

                    <SpørsmålMedDatovelger
                        spørsmålName="svar.alderspensjon.svar"
                        datoName="svar.alderspensjon.fraOgMed"
                        tittel="Når begynner brukers alderspensjon?"
                        legend="Mottar alderspensjon"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.supplerendeStønadAlder.svar"
                        periodeName="svar.supplerendeStønadAlder.periode"
                        spørsmål="Mottar supplerende stønad for personer over 67 år med kort botid i Norge i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for personer over 67 år med kort botid i Norge?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.supplerendeStønadFlyktning.svar"
                        periodeName="svar.supplerendeStønadFlyktning.periode"
                        spørsmål="Mottar supplerende stønad for uføre flyktninger i perioden"
                        periodeSpørsmål="I hvilken del av perioden svar bruker supplerende stønad for uføre flyktninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.trygdOgPensjon.svar"
                        periodeName="svar.trygdOgPensjon.periode"
                        spørsmål="Mottar pengestøtte fra andre trygde- eller pensjonsordninger"
                        periodeSpørsmål="I hvilken del av perioden svar bruker pengestøtte fra andre trygde- eller pensjonsordninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.jobbsjansen.svar"
                        periodeName="svar.jobbsjansen.periode"
                        spørsmål="Mottar stønad gjennom Jobbsjansen"
                        periodeSpørsmål="I hvilken del av perioden svar bruker stønad gjennom Jobbsjansen?"
                    />
                </>
            )}
        </div>
    );
};
