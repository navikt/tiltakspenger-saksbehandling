import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import type {
    ManueltRegistrertSøknad,
    SøknadstypeManueltRegistrertSøknad,
} from './ManueltRegistrertSøknad';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';

const søknadstypeValg: { value: SøknadstypeManueltRegistrertSøknad; label: string }[] = [
    { value: 'DIGITAL', label: søknadstypeTekst.DIGITAL },
    { value: 'PAPIR_SKJEMA', label: søknadstypeTekst.PAPIR_SKJEMA },
    { value: 'PAPIR_FRIHAND', label: søknadstypeTekst.PAPIR_FRIHAND },
    { value: 'MODIA', label: søknadstypeTekst.MODIA },
    { value: 'ANNET', label: søknadstypeTekst.ANNET },
];

export const SøknadstypeSelect = () => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();

    return (
        <Controller
            name="søknadstype"
            control={control}
            rules={{ required: 'Søknadstype er påkrevd' }}
            render={({ field, fieldState }) => (
                <Select
                    label="Søknadstype"
                    value={field.value ?? ''}
                    onChange={(event) =>
                        field.onChange(event.target.value as SøknadstypeManueltRegistrertSøknad)
                    }
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                >
                    <option value="" disabled>
                        Velg søknadstype
                    </option>
                    {søknadstypeValg.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            )}
        />
    );
};
