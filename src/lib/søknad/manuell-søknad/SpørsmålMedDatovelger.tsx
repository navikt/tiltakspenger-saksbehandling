import { FieldPath, FieldPathByValue, useController, useFormContext } from 'react-hook-form';
import { useRef } from 'react';
import { JaNeiSpørsmål } from '~/lib/søknad/manuell-søknad/JaNeiSpørsmål';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import type { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './SpørsmålMedDatoVelger.module.css';
import { dateTilISOTekst } from '~/utils/date';
import { datovalideringsfeil } from '~/lib/_felles/datovelger/datovelgerUtils';

type Props = {
    spørsmålFelt: FieldPath<ManueltRegistrertSøknad>;
    datoFelt: FieldPathByValue<ManueltRegistrertSøknad, string | undefined>;
    legend: string;
    tittel?: string;
};

export const SpørsmålMedDatovelger = ({ spørsmålFelt, datoFelt, legend, tittel }: Props) => {
    const {
        control,
        resetField,
        setValue,
        getValues,
        trigger,
        formState: { isSubmitted },
    } = useFormContext<ManueltRegistrertSøknad>();
    const datoValideringsfeil = useRef<string | undefined>(undefined);

    const jaNeiSpørsmål = useController({
        name: spørsmålFelt,
        control,
        defaultValue: undefined,
    });

    const datoController = useController({
        name: datoFelt,
        control,
        rules: {
            validate: () =>
                getValues(spørsmålFelt) === 'JA' ? (datoValideringsfeil.current ?? true) : true,
        },
    });

    return (
        <div className={jaNeiSpørsmål.field.value === 'JA' ? styles.blokkUtvidet : ''}>
            <JaNeiSpørsmål
                name={spørsmålFelt}
                legend={legend}
                onChange={(newValue) => {
                    if (newValue !== 'JA') {
                        datoValideringsfeil.current = undefined;
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
                            ref={datoController.field.ref}
                            label={'Fra og med (dd.mm.åååå)'}
                            onDateChange={(date) => {
                                setValue(datoFelt, date ? dateTilISOTekst(date) : undefined, {
                                    shouldDirty: true,
                                });
                            }}
                            onValidate={(validering) => {
                                datoValideringsfeil.current = datovalideringsfeil(validering);
                                if (isSubmitted) {
                                    void trigger(datoFelt);
                                }
                            }}
                            error={datoController.fieldState.error?.message}
                        />
                    </VStack>
                </div>
            )}
        </div>
    );
};
