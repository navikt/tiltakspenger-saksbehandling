import React from 'react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Spørsmål } from '~/components/papirsøknad/Spørsmål';
import { Datovelger } from '~/components/datovelger/Datovelger';
import type { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './Spørsmål.module.css';

type Props = {
    spørsmålName: FieldPath<Søknad>;
    datoName: FieldPath<Søknad>;
    legend: string;
    tittel?: string;
};

export const SpørsmålMedDatovelger = ({ spørsmålName, datoName, legend, tittel }: Props) => {
    const { control } = useFormContext<Søknad>();

    const spørsmål = useController({
        name: spørsmålName,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={spørsmål.field.value ? styles.blokkUtvidet : ''}>
            <Spørsmål name={spørsmålName} legend={legend} />

            {spørsmål.field.value && (
                <div className={styles.blokk}>
                    <VStack gap="2">
                        {tittel && (
                            <Heading size="xsmall" level="4">
                                {tittel}
                            </Heading>
                        )}
                        <Datovelger name={datoName} label={'Fra og med (dd.mm.åååå)'} />
                    </VStack>
                </div>
            )}
        </div>
    );
};
