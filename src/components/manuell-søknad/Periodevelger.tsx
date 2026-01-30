import React from 'react';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { FieldPath, RegisterOptions, useController, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import styles from './Spørsmål.module.css';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    fraOgMedFelt: FieldPath<ManueltRegistrertSøknad>;
    tilOgMedFelt: FieldPath<ManueltRegistrertSøknad>;
    tittel?: string;
    rules?: {
        fraOgMed?: RegisterOptions<ManueltRegistrertSøknad, FieldPath<ManueltRegistrertSøknad>>;
        tilOgMed?: RegisterOptions<ManueltRegistrertSøknad, FieldPath<ManueltRegistrertSøknad>>;
        validateRange?: (
            fraOgMed: string | undefined,
            tilOgMed: string | undefined,
        ) => string | true;
    };
};

export const Periodevelger = ({ fraOgMedFelt, tilOgMedFelt, tittel, rules }: Props) => {
    const { control, watch, setError, clearErrors } = useFormContext<ManueltRegistrertSøknad>();
    const fraOgMedDatoWatch = watch(fraOgMedFelt) as string | undefined;
    const tilOgMedDatoWatch = watch(tilOgMedFelt) as string | undefined;

    const fraOgMedDatoController = useController({
        name: fraOgMedFelt,
        control,
        rules: {
            ...rules?.fraOgMed,
            validate: () => {
                if (!rules?.validateRange) return true;
                const result = rules.validateRange(fraOgMedDatoWatch, tilOgMedDatoWatch);

                if (result !== true) {
                    setError(tilOgMedFelt, { type: 'validate', message: result as string });
                    return result;
                } else {
                    clearErrors(tilOgMedFelt);
                    clearErrors(fraOgMedFelt);
                    return true;
                }
            },
        },
    });

    const tilOgMedDatoController = useController({
        name: tilOgMedFelt,
        control,
        rules: {
            ...rules?.tilOgMed,
            validate: () => {
                if (!rules?.validateRange) return true;
                const result = rules.validateRange(fraOgMedDatoWatch, tilOgMedDatoWatch);

                if (result !== true) {
                    setError(fraOgMedFelt, { type: 'validate', message: result as string });
                    return result;
                } else {
                    clearErrors(tilOgMedFelt);
                    clearErrors(fraOgMedFelt);
                    return true;
                }
            },
        },
    });

    return (
        <div className={styles.blokk}>
            <VStack gap="space-16">
                {tittel && (
                    <Heading size="xsmall" level="3">
                        {tittel}
                    </Heading>
                )}
                <HStack gap="space-32">
                    <Datovelger
                        label="Fra og med"
                        selected={fraOgMedDatoController.field.value as string | undefined}
                        onDateChange={(dato) =>
                            fraOgMedDatoController.field.onChange(dato ? dateTilISOTekst(dato) : '')
                        }
                        error={
                            fraOgMedDatoController.fieldState.error?.message as string | undefined
                        }
                    />
                    <Datovelger
                        label="Til og med"
                        selected={tilOgMedDatoController.field.value as string | undefined}
                        onDateChange={(dato) =>
                            tilOgMedDatoController.field.onChange(dato ? dateTilISOTekst(dato) : '')
                        }
                        error={
                            tilOgMedDatoController.fieldState.error?.message as string | undefined
                        }
                    />
                </HStack>
            </VStack>
        </div>
    );
};
