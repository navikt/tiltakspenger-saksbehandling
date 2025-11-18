import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import { Datovelger } from '~/components/datovelger/Datovelger';
import type { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './Spørsmål.module.css';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    spørsmålFelt: FieldPath<Papirsøknad>;
    datoFelt: FieldPath<Papirsøknad>;
    legend: string;
    tittel?: string;
};

export const SpørsmålMedDatovelger = ({ spørsmålFelt, datoFelt, legend, tittel }: Props) => {
    const { control, resetField, setValue } = useFormContext<Papirsøknad>();

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
                    <VStack gap="2">
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
