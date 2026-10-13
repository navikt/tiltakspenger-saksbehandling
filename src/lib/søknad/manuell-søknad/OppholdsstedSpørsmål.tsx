import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { FieldPath, useController, useFormContext } from 'react-hook-form';
import {
    ManuellSøknadOppholdsstedSvar,
    ManueltRegistrertSøknad,
} from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { manuellSøknadOppholdsstedSvarTekst } from '~/lib/søknad/søknadTekster';
import styles from './JaNeiSpørsmål.module.css';

type Props = {
    name: FieldPath<ManueltRegistrertSøknad>;
    legend: string;
};

const svaralternativer: ManuellSøknadOppholdsstedSvar[] = [
    'NORGE',
    'ANNET_EØS_LAND',
    'IKKE_EØS_LAND',
    'IKKE_BESVART',
];

export const OppholdsstedSpørsmål = ({ name, legend }: Props) => {
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

    const valgtSvar = (controller.field.value as ManuellSøknadOppholdsstedSvar | undefined) ?? '';

    return (
        <div className={styles.blokk}>
            <RadioGroup
                legend={legend}
                value={valgtSvar}
                error={controller.fieldState.error?.message}
                onChange={(value: ManuellSøknadOppholdsstedSvar) =>
                    controller.field.onChange(value)
                }
                onBlur={controller.field.onBlur}
            >
                <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                    {svaralternativer.map((svar) => (
                        <Radio key={svar} value={svar}>
                            {manuellSøknadOppholdsstedSvarTekst[svar]}
                        </Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </div>
    );
};
