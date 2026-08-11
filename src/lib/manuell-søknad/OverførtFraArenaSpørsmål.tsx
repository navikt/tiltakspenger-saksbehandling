import { Select } from '@navikt/ds-react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import type {
    JaNeiSvar,
    ManueltRegistrertSøknad,
    SøknadBehandlingsårsakManueltRegistrertSøknad,
} from './ManueltRegistrertSøknad';
import { JaNeiSpørsmål } from '~/lib/manuell-søknad/JaNeiSpørsmål';
import { søknadBehandlingsårsakTekst } from '~/lib/søknad/søknadTekster';

const behandlingsårsaker: ReadonlyArray<{
    value: SøknadBehandlingsårsakManueltRegistrertSøknad;
    label: string;
}> = [
    {
        value: 'FORLENGELSE_FRA_ARENA',
        label: søknadBehandlingsårsakTekst.FORLENGELSE_FRA_ARENA,
    },
    {
        value: 'SOKNADSBEHANDLING_FRA_ARENA',
        label: søknadBehandlingsårsakTekst.SOKNADSBEHANDLING_FRA_ARENA,
    },
    {
        value: 'OVERLAPPENDE_TILTAK_I_ARENA',
        label: søknadBehandlingsårsakTekst.OVERLAPPENDE_TILTAK_I_ARENA,
    },
    { value: 'ANNET', label: søknadBehandlingsårsakTekst.ANNET },
] as const;

export const OverførtFraArenaSpørsmål = () => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();
    const methods = useFormContext();

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

                        if (
                            !behandlingsårsakField.value &&
                            (value as SøknadBehandlingsårsakManueltRegistrertSøknad) ===
                                'FORLENGELSE_FRA_ARENA'
                        ) {
                            methods.setValue('svar.kvp.svar', 'NEI');
                            methods.setValue('svar.intro.svar', 'NEI');
                            methods.setValue('svar.etterlønn.svar', 'NEI');
                            methods.setValue('svar.sykepenger.svar', 'NEI');
                            methods.setValue('svar.mottarAndreUtbetalinger', 'NEI');
                            methods.setValue('svar.institusjon.svar', 'NEI');
                        }
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
