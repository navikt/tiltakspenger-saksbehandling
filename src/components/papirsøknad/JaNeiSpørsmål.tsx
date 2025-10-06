import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';

type Props = {
    name: FieldPath<Søknad>;
    legend: string;
    details?: React.ReactNode;
    onChange?: (() => void) | undefined;
    måVæreBesvart?: boolean;
};

export const JaNeiSpørsmål = ({ name, legend, details, onChange, måVæreBesvart }: Props) => {
    const { control } = useFormContext<Søknad>();

    const controller = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={styles.blokk}>
            <RadioGroup
                legend={legend}
                value={controller.field.value as boolean}
                onChange={(value: boolean) => {
                    controller.field.onChange(value);
                    onChange?.();
                }}
            >
                {details}
                <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    <Radio value={true}>Ja</Radio>
                    <Radio value={false}>Nei</Radio>
                    {!måVæreBesvart && <Radio value={null}>Ikke besvart</Radio>}
                </Stack>
            </RadioGroup>
        </div>
    );
};
