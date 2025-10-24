import React from 'react';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { Periode } from '~/types/Periode';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';

type Props = {
    name: FieldPath<Papirsøknad>;
    tittel?: string;
    value?: Periode;
};

export const Periodevelger = ({ name, tittel }: Props) => {
    const { control } = useFormContext<Papirsøknad>();

    const periode = useController({
        name: name,
        control,
        defaultValue: { fraOgMed: '', tilOgMed: '' } as Periode,
    });

    const current = periode.field.value as Periode;
    const onChangeFraOgMed = (dato: Date | undefined) =>
        periode.field.onChange({ ...current, fraOgMed: dato ? dateTilISOTekst(dato) : undefined });
    const onChangeTilOgMed = (dato: Date | undefined) =>
        periode.field.onChange({ ...current, tilOgMed: dato ? dateTilISOTekst(dato) : undefined });

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
                        value={
                            current.fraOgMed ? datoTilDatoInputText(current.fraOgMed) : undefined
                        }
                        onDateChange={onChangeFraOgMed}
                    />
                    <Datovelger
                        label="Til og med"
                        value={
                            current.tilOgMed ? datoTilDatoInputText(current.tilOgMed) : undefined
                        }
                        onDateChange={onChangeTilOgMed}
                    />
                </HStack>
            </VStack>
        </div>
    );
};
