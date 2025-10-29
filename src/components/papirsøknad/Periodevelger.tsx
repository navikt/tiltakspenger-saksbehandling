import React from 'react';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { FieldPath, RegisterOptions, useController, useFormContext } from 'react-hook-form';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    name: FieldPath<Papirsøknad>;
    tittel?: string;
    rules?: {
        fraOgMed?: RegisterOptions<Papirsøknad, FieldPath<Papirsøknad>>;
        tilOgMed?: RegisterOptions<Papirsøknad, FieldPath<Papirsøknad>>;
    };
};

export const Periodevelger = ({ name, tittel, rules }: Props) => {
    const { control } = useFormContext<Papirsøknad>();

    const fraField = useController({
        name: `${name}.fraOgMed` as FieldPath<Papirsøknad>,
        control,
        rules: rules?.fraOgMed,
    });
    const tilField = useController({
        name: `${name}.tilOgMed` as FieldPath<Papirsøknad>,
        control,
        rules: rules?.tilOgMed,
    });

    const fraValue = fraField.field.value as string | undefined;
    const tilValue = tilField.field.value as string | undefined;

    const fraError = fraField.fieldState.error?.message as string | undefined;
    const tilError = tilField.fieldState.error?.message as string | undefined;

    return (
        <div className={styles.blokk}>
            <VStack gap="4">
                {tittel && (
                    <Heading size="xsmall" level="3">
                        {tittel}
                    </Heading>
                )}
                <HStack gap="8">
                    <Datovelger
                        label="Fra og med"
                        selected={fraValue || undefined}
                        onDateChange={(dato) =>
                            fraField.field.onChange(dato ? dateTilISOTekst(dato) : '')
                        }
                        error={fraError}
                    />
                    <Datovelger
                        label="Til og med"
                        selected={tilValue || undefined}
                        onDateChange={(dato) =>
                            tilField.field.onChange(dato ? dateTilISOTekst(dato) : '')
                        }
                        error={tilError}
                    />
                </HStack>
            </VStack>
        </div>
    );
};
