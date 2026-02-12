import { Select } from '@navikt/ds-react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import type {
    JaNeiSvar,
    ManueltRegistrertSøknad,
    SøknadBehandlingsårsakManueltRegistrertSøknad,
} from './ManueltRegistrertSøknad';
import { formaterSøknadBehandlingsårsak } from '~/utils/tekstformateringUtils';
import { JaNeiSpørsmål } from '~/components/manuell-søknad/JaNeiSpørsmål';

const behandlingsårsaker: ReadonlyArray<{
    value: SøknadBehandlingsårsakManueltRegistrertSøknad;
    label: string;
}> = [
    {
        value: 'FORLENGELSE_FRA_ARENA',
        label: formaterSøknadBehandlingsårsak('FORLENGELSE_FRA_ARENA'),
    },
    {
        value: 'SOKNADSBEHANDLING_FRA_ARENA',
        label: formaterSøknadBehandlingsårsak('SOKNADSBEHANDLING_FRA_ARENA'),
    },
    {
        value: 'OVERLAPPENDE_TILTAK_I_ARENA',
        label: formaterSøknadBehandlingsårsak('OVERLAPPENDE_TILTAK_I_ARENA'),
    },
    { value: 'ANNET', label: formaterSøknadBehandlingsårsak('ANNET') },
] as const;

export const OverførtFraArenaSpørsmål = () => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();

    const overførtFraArenaSvar = useWatch({ control, name: 'overfortFraArena' }) as
        | JaNeiSvar
        | undefined;
    const skalViseBehandlingsårsak = overførtFraArenaSvar === 'JA';

    const { field: behandlingsårsakField, fieldState: behandlingsårsakFieldState } = useController({
        name: 'behandlingsarsak',
        control,
        defaultValue: undefined,
        rules: {
            validate: (value) => {
                if (!skalViseBehandlingsårsak) {
                    return true;
                }

                return value ? true : 'Behandlingsårsak er påkrevd';
            },
        },
    });

    return (
        <>
            <JaNeiSpørsmål
                name={'overfortFraArena'}
                legend={'Overført fra Arena?'}
                måVæreBesvart={true}
            />

            {skalViseBehandlingsårsak && (
                <Select
                    label={'Behandlingsårsak'}
                    value={behandlingsårsakField.value ?? ''}
                    onChange={(event) => {
                        const value = event.target.value;
                        behandlingsårsakField.onChange(
                            value
                                ? (value as SøknadBehandlingsårsakManueltRegistrertSøknad)
                                : undefined,
                        );
                    }}
                    onBlur={behandlingsårsakField.onBlur}
                    error={behandlingsårsakFieldState.error?.message}
                >
                    <option value="" disabled>
                        {'Velg behandlingsårsak'}
                    </option>
                    {behandlingsårsaker.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            )}
        </>
    );
};
