import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import type { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';

import styles from './Spørsmål.module.css';
import { SpørsmålMedPeriodevelger } from '~/components/papirsøknad/SpørsmålMedPeriodevelger';
import { List } from '@navikt/ds-react';
import { SpørsmålMedDatovelger } from '~/components/papirsøknad/SpørsmålMedDatovelger';

type Props = {
    name: FieldPath<Søknad>;
    legend: string;
    tittel?: string;
};

export const MottarPengestøtterSpørsmål = ({ name, legend }: Props) => {
    const { control, resetField } = useFormContext<Søknad>();

    const spørsmål = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    const nullstillFelter = (): void => {
        resetField('svar.gjenlevendepensjon.mottar');
        resetField('svar.gjenlevendepensjon.periode');
        resetField('svar.alderspensjon.mottar');
        resetField('svar.alderspensjon.fraDato');
        resetField('svar.supplerendestønadover67.mottar');
        resetField('svar.supplerendestønadover67.periode');
        resetField('svar.supplerendestønadflyktninger.mottar');
        resetField('svar.supplerendestønadflyktninger.periode');
        resetField('svar.pensjonsordning.mottar');
        resetField('svar.pensjonsordning.periode');
        resetField('svar.jobbsjansen.mottar');
        resetField('svar.jobbsjansen.periode');
    };

    return (
        <div className={spørsmål.field.value ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={name}
                legend={legend}
                onChange={() => {
                    if (!spørsmål.field.value) {
                        nullstillFelter();
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
            {spørsmål.field.value && (
                <>
                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.gjenlevendepensjon.mottar"
                        periodeName="svar.gjenlevendepensjon.periode"
                        spørsmål="Mottar pengestøtte til gjenlevende ektefelle"
                        periodeSpørsmål="I hvilken del av perioden mottar bruker pengestøtte til gjenlevende ektefelle?"
                    />

                    <SpørsmålMedDatovelger
                        spørsmålName="svar.alderspensjon.mottar"
                        datoName="svar.alderspensjon.fraDato"
                        tittel="Når begynner brukers alderspensjon?"
                        legend="Mottar pengestøtte til gjenlevende ektefelle"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.supplerendestønadover67.mottar"
                        periodeName="svar.supplerendestønadover67.periode"
                        spørsmål="Mottar supplerende stønad for personer over 67 år med kort botid i Norge i perioden"
                        periodeSpørsmål="I hvilken del av perioden mottar bruker supplerende stønad for personer over 67 år med kort botid i Norge?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.supplerendestønadflyktninger.mottar"
                        periodeName="svar.supplerendestønadflyktninger.periode"
                        spørsmål="Mottar supplerende stønad for uføre flyktninger i perioden"
                        periodeSpørsmål="I hvilken del av perioden mottar bruker supplerende stønad for uføre flyktninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.pensjonsordning.mottar"
                        periodeName="svar.pensjonsordning.periode"
                        spørsmål="Mottar pengestøtte fra andre trygde- eller pensjonsordninger"
                        periodeSpørsmål="I hvilken del av perioden mottar bruker pengestøtte fra andre trygde- eller pensjonsordninger?"
                    />

                    <SpørsmålMedPeriodevelger
                        spørsmålName="svar.jobbsjansen.mottar"
                        periodeName="svar.jobbsjansen.periode"
                        spørsmål="Mottar stønad gjennom Jobbsjansen"
                        periodeSpørsmål="I hvilken del av perioden mottar bruker stønad gjennom Jobbsjansen?"
                    />
                </>
            )}
        </div>
    );
};
