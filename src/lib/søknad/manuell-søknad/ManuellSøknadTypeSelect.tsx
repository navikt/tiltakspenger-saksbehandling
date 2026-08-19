import { Select } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import type { ManueltRegistrertSøknad } from './ManueltRegistrertSøknad';
import { SøknadstypeManueltRegistrertSøknad } from './ManueltRegistrertSøknad';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';

export const ManuellSøknadTypeSelect = () => {
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
                    {Object.values(SøknadstypeManueltRegistrertSøknad).map((option) => (
                        <option key={option} value={option}>
                            {søknadstypeTekst[option]}
                        </option>
                    ))}
                </Select>
            )}
        />
    );
};
