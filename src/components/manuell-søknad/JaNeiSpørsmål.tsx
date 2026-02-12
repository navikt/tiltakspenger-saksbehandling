import React from 'react';
import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import {
    JaNeiSvar,
    ManueltRegistrertSøknad,
} from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import styles from './JaNeiSpørsmål.module.css';

type Props = {
    name: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
    details?: React.ReactNode;
    onChange?: (value: JaNeiSvar | undefined) => void;
    måVæreBesvart?: boolean;
};

export const JaNeiSpørsmål = ({
    name,
    legend,
    details,
    onChange,
    måVæreBesvart = false,
}: Props) => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();

    const controller = useController({
        name,
        control,
        defaultValue: undefined,
        rules: {
            validate: (v) => {
                if (v === undefined) return 'Du må velge et svar.';
                return true;
            },
        },
    });

    const errorMessage = controller.fieldState.error?.message;
    const valgtSvar = (controller.field.value as JaNeiSvar | undefined) ?? '';

    return (
        <div className={styles.blokk}>
            <RadioGroup
                key={`${name}-${måVæreBesvart ? 'required' : 'optional'}`}
                legend={legend}
                value={valgtSvar}
                error={errorMessage}
                onChange={(value: JaNeiSvar) => {
                    controller.field.onChange(value);
                    onChange?.(value);
                }}
                onBlur={controller.field.onBlur}
            >
                {details}
                <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    <Radio value="JA">Ja</Radio>
                    <Radio value="NEI">Nei</Radio>
                    {!måVæreBesvart && <Radio value="IKKE_BESVART">Ikke besvart</Radio>}
                </Stack>
            </RadioGroup>
        </div>
    );
};
