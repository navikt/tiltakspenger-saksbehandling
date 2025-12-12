import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ManueltRegistrertSøknad, Søknadstype } from './ManueltRegistrertSøknad';

const søknadstypeValg: { value: Søknadstype; label: string }[] = [
    { value: 'PAPIR_SKJEMA', label: 'Papirsøknad - skjema' },
    { value: 'PAPIR_FRIHÅND', label: 'Papirsøknad - frihånd' },
    { value: 'MODIA', label: 'Søknad fra modia' },
    { value: 'ANNET', label: 'Annet' },
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
                    onChange={(event) => field.onChange(event.target.value as Søknadstype)}
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
