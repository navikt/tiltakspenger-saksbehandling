import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { FieldPathByValue, useController, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import styles from './Periodevelger.module.css';
import { dateTilISOTekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useMemo } from 'react';

export type ManuellSøknadPeriodeFelt = FieldPathByValue<
    ManueltRegistrertSøknad,
    Periode | undefined
>;

export type ManuellSøknadPeriodeValidationErrors = {
    fraOgMed?: string;
    tilOgMed?: string;
    periode?: string;
};

type Props = {
    periodeFelt: ManuellSøknadPeriodeFelt;
    tittel?: string;
    validate?: (periode: Partial<Periode>) => ManuellSøknadPeriodeValidationErrors;
};

export const Periodevelger = ({ periodeFelt, tittel, validate }: Props) => {
    const { control, watch, setError } = useFormContext<ManueltRegistrertSøknad>();

    const periodeWatch = watch(periodeFelt);

    const validationErrors = useMemo(
        () => validate?.(periodeWatch ?? {}) ?? {},
        [periodeWatch, validate],
    );

    const periodeController = useController({
        name: periodeFelt,
        control,
        rules: {
            validate: () => {
                if (validationErrors.periode) {
                    setError(periodeFelt, {
                        type: 'validate',
                        message: validationErrors.periode,
                    });
                    return validationErrors.periode;
                }

                return true;
            },
        },
    });

    const fraOgMedController = useController({
        name: `${periodeFelt}.fraOgMed`,
        control,
        rules: {
            validate: () => {
                if (validationErrors.fraOgMed) {
                    setError(`${periodeFelt}.fraOgMed`, {
                        type: 'validate',
                        message: validationErrors.fraOgMed,
                    });
                    return validationErrors.fraOgMed;
                }

                return true;
            },
        },
    });

    const tilOgMedController = useController({
        name: `${periodeFelt}.tilOgMed`,
        control,
        rules: {
            validate: () => {
                if (validationErrors.tilOgMed) {
                    setError(`${periodeFelt}.tilOgMed`, {
                        type: 'validate',
                        message: validationErrors.tilOgMed,
                    });
                    return validationErrors.tilOgMed;
                }

                return true;
            },
        },
    });

    return (
        <VStack gap="space-16" className={styles.blokk}>
            {tittel && (
                <Heading size="xsmall" level="3">
                    {tittel}
                </Heading>
            )}
            {periodeController.fieldState.error?.message && (
                <Infokort variant={'feil'}>{periodeController.fieldState.error.message}</Infokort>
            )}
            <HStack gap="space-32">
                <Datovelger
                    label="Fra og med"
                    selected={fraOgMedController.field.value}
                    onDateChange={(dato) =>
                        fraOgMedController.field.onChange(dato ? dateTilISOTekst(dato) : undefined)
                    }
                    error={fraOgMedController.fieldState.error?.message}
                />
                <Datovelger
                    label="Til og med"
                    selected={tilOgMedController.field.value}
                    onDateChange={(dato) =>
                        tilOgMedController.field.onChange(dato ? dateTilISOTekst(dato) : undefined)
                    }
                    error={tilOgMedController.fieldState.error?.message}
                />
            </HStack>
        </VStack>
    );
};
