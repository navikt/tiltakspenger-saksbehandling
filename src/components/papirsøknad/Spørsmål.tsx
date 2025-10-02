import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Søknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';

type Props = {
    name: FieldPath<Søknad>;
    legend: string;
    details?: React.ReactNode;
    onChange?: ((val: boolean) => void) | undefined;
};

export const Spørsmål = ({ name, legend, details }: Props) => {
    const { control } = useFormContext<Søknad>();

    const spørsmål = useController({
        name: name,
        control,
        defaultValue: undefined,
    });

    return (
        <div className={styles.blokk}>
            <RadioGroup
                legend={legend}
                value={spørsmål.field.value as boolean}
                onChange={(val: boolean) => spørsmål.field.onChange(val)}
            >
                {details}
                <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    <Radio value={true}>Ja</Radio>
                    <Radio value={false}>Nei</Radio>
                    <Radio value={null}>Ikke besvart</Radio>
                </Stack>
            </RadioGroup>
        </div>
    );
};
