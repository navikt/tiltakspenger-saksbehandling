import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import styles from './Spørsmål.module.css';

type Props = {
    name: FieldPath<Papirsøknad>;
    legend: string;
    details?: React.ReactNode;
    onChange?: (value: boolean | null | undefined) => void;
    måVæreBesvart?: boolean;
};

// TODO denne sjekken er litt skitten, tror ja/nei/ikke besvart burde vært eksplisitte typer og ikke bare en boolean
const isBooleanish = (v: unknown): v is boolean | null | undefined =>
    v === true || v === false || v === null || v === undefined;

export const JaNeiSpørsmål = ({ name, legend, details, onChange, måVæreBesvart }: Props) => {
    const { control } = useFormContext<Papirsøknad>();

    const controller = useController({
        name,
        control,
        defaultValue: undefined,
        rules: {
            validate: (v) =>
                (måVæreBesvart ? v === true || v === false : true) || 'Du må velge et svar',
        },
    });

    const rawValue = isBooleanish(controller.field.value) ? controller.field.value : undefined;
    const radioGroupValue =
        rawValue === undefined ? '' : rawValue === null ? 'null' : rawValue ? 'true' : 'false';
    const errorMessage = controller.fieldState.error?.message;

    return (
        <div className={styles.blokk}>
            <RadioGroup
                legend={legend}
                value={radioGroupValue}
                error={errorMessage}
                onChange={(v: string) => {
                    // TODO denne mappingen er litt skitten, tror ja/nei/ikke besvart burde vært eksplisitte typer og ikke bare en boolean
                    let mapped: boolean | null | undefined;
                    if (v === 'true') mapped = true;
                    else if (v === 'false') mapped = false;
                    else if (v === 'null') mapped = null;
                    else mapped = undefined;
                    controller.field.onChange(mapped);
                    onChange?.(mapped);
                }}
            >
                {details}
                <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    <Radio value="true">Ja</Radio>
                    <Radio value="false">Nei</Radio>
                    {!måVæreBesvart && <Radio value="null">Ikke besvart</Radio>}
                </Stack>
            </RadioGroup>
        </div>
    );
};
