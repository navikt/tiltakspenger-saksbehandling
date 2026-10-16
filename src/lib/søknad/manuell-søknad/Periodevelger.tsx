import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { FieldPathByValue, useController, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import styles from './Periodevelger.module.css';
import { dateTilISOTekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useRef } from 'react';
import { datovalideringsfeil } from '~/lib/_felles/datovelger/datovelgerUtils';

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
    const {
        control,
        getValues,
        setValue,
        trigger,
        formState: { isSubmitted },
    } = useFormContext<ManueltRegistrertSøknad>();
    const fraOgMedValideringsfeil = useRef<string | undefined>(undefined);
    const tilOgMedValideringsfeil = useRef<string | undefined>(undefined);

    const hentPeriodeValideringsfeil = () => validate?.(getValues(periodeFelt) ?? {}) ?? {};

    const revaliderPeriode = () => {
        if (isSubmitted) {
            void trigger([periodeFelt, `${periodeFelt}.fraOgMed`, `${periodeFelt}.tilOgMed`]);
        }
    };

    const periodeController = useController({
        name: periodeFelt,
        control,
        rules: {
            validate: () => hentPeriodeValideringsfeil().periode ?? true,
        },
    });

    const fraOgMedController = useController({
        name: `${periodeFelt}.fraOgMed`,
        control,
        rules: {
            validate: () =>
                fraOgMedValideringsfeil.current ?? hentPeriodeValideringsfeil().fraOgMed ?? true,
        },
    });

    const tilOgMedController = useController({
        name: `${periodeFelt}.tilOgMed`,
        control,
        rules: {
            validate: () =>
                tilOgMedValideringsfeil.current ?? hentPeriodeValideringsfeil().tilOgMed ?? true,
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
                    name={fraOgMedController.field.name}
                    ref={fraOgMedController.field.ref}
                    label="Fra og med"
                    selected={fraOgMedController.field.value}
                    onDateChange={(dato) =>
                        setValue(
                            `${periodeFelt}.fraOgMed`,
                            dato ? dateTilISOTekst(dato) : undefined,
                            {
                                shouldDirty: true,
                            },
                        )
                    }
                    onValidate={(validering) => {
                        fraOgMedValideringsfeil.current = datovalideringsfeil(validering);
                        revaliderPeriode();
                    }}
                    error={fraOgMedController.fieldState.error?.message}
                />
                <Datovelger
                    name={tilOgMedController.field.name}
                    ref={tilOgMedController.field.ref}
                    label="Til og med"
                    selected={tilOgMedController.field.value}
                    onDateChange={(dato) =>
                        setValue(
                            `${periodeFelt}.tilOgMed`,
                            dato ? dateTilISOTekst(dato) : undefined,
                            {
                                shouldDirty: true,
                            },
                        )
                    }
                    onValidate={(validering) => {
                        tilOgMedValideringsfeil.current = datovalideringsfeil(validering);
                        revaliderPeriode();
                    }}
                    error={tilOgMedController.fieldState.error?.message}
                />
            </HStack>
        </VStack>
    );
};
