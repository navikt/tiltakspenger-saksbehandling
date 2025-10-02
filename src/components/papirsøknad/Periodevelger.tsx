import React from 'react';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { Periode } from '~/types/Periode';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';

type Props = {
    name: FieldPath<Søknad>;
    tittel?: string;
    value?: Periode;
};

export const Periodevelger = ({ name, tittel }: Props) => {
    const { control } = useFormContext<Søknad>();

    const periode = useController({
        name: name,
        control,
        defaultValue: { fraOgMed: '', tilOgMed: '' } as Periode,
    });

    const current = periode.field.value as Periode;
    const onChangeFraOgMed = (dato: Date | undefined) =>
        periode.field.onChange({ ...current, fraOgMed: dato });
    const onChangeTilOgMed = (dato: Date | undefined) =>
        periode.field.onChange({ ...current, tilOgMed: dato });

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
                        value={current.fraOgMed}
                        onDateChange={onChangeFraOgMed}
                    />
                    <Datovelger
                        label="Til og med"
                        value={current.tilOgMed}
                        onDateChange={onChangeTilOgMed}
                    />
                </HStack>
            </VStack>
        </div>
    );
};
