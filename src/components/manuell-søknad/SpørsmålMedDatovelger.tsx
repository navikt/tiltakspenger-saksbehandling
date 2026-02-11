import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { JaNeiSpørsmål } from '~/components/manuell-søknad/JaNeiSpørsmål';
import { Datovelger } from '~/components/datovelger/Datovelger';
import type { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './SpørsmålMedDatoVelger.module.css';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    spørsmålFelt: FieldPath<ManueltRegistrertSøknad>;
    datoFelt: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
    tittel?: string;
};

export const SpørsmålMedDatovelger = ({ spørsmålFelt, datoFelt, legend, tittel }: Props) => {
    const { control, resetField, setValue } = useFormContext<ManueltRegistrertSøknad>();

    const jaNeiSpørsmål = useController({
        name: spørsmålFelt,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={jaNeiSpørsmål.field.value === 'JA' ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={spørsmålFelt}
                legend={legend}
                onChange={(newValue) => {
                    if (newValue !== 'JA') {
                        resetField(datoFelt);
                    }
                }}
            />
            {jaNeiSpørsmål.field.value === 'JA' && (
                <div className={styles.blokk}>
                    <VStack gap="space-8">
                        {tittel && (
                            <Heading size="xsmall" level="4">
                                {tittel}
                            </Heading>
                        )}
                        <Datovelger
                            name={datoFelt}
                            label={'Fra og med (dd.mm.åååå)'}
                            onDateChange={(date) => {
                                setValue(datoFelt, date ? dateTilISOTekst(date) : undefined);
                            }}
                        />
                    </VStack>
                </div>
            )}
        </div>
    );
};
