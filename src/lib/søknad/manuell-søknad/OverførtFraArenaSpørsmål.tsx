import { Select } from '@navikt/ds-react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import type { ManueltRegistrertSøknad } from './ManueltRegistrertSøknad';
import { SøknadBehandlingsårsakManueltRegistrertSøknad } from './ManueltRegistrertSøknad';
import type { JaNeiSvar } from '~/lib/søknad/søknadTyper';
import { JaNeiSpørsmål } from '~/lib/søknad/manuell-søknad/JaNeiSpørsmål';
import { søknadBehandlingsårsakTekst } from '~/lib/søknad/søknadTekster';
import { manuellSøknadHåndterPengestøtterSvar } from '~/lib/søknad/manuell-søknad/MottarPengestøtterSpørsmål';

const behandlingsårsaker: ReadonlyArray<{
    value: SøknadBehandlingsårsakManueltRegistrertSøknad;
    label: string;
}> = [
    {
        value: SøknadBehandlingsårsakManueltRegistrertSøknad.FORLENGELSE_FRA_ARENA,
        label: søknadBehandlingsårsakTekst.FORLENGELSE_FRA_ARENA,
    },
    {
        value: SøknadBehandlingsårsakManueltRegistrertSøknad.SOKNADSBEHANDLING_FRA_ARENA,
        label: søknadBehandlingsårsakTekst.SOKNADSBEHANDLING_FRA_ARENA,
    },
    {
        value: SøknadBehandlingsårsakManueltRegistrertSøknad.OVERLAPPENDE_TILTAK_I_ARENA,
        label: søknadBehandlingsårsakTekst.OVERLAPPENDE_TILTAK_I_ARENA,
    },
    {
        value: SøknadBehandlingsårsakManueltRegistrertSøknad.ANNET,
        label: søknadBehandlingsårsakTekst.ANNET,
    },
] as const;

export const OverførtFraArenaSpørsmål = () => {
    const formContext = useFormContext<ManueltRegistrertSøknad>();
    const { control } = formContext;

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
                            value ===
                                SøknadBehandlingsårsakManueltRegistrertSøknad.FORLENGELSE_FRA_ARENA
                        ) {
                            formContext.setValue('svar.kvp.svar', 'NEI');
                            formContext.setValue('svar.intro.svar', 'NEI');
                            formContext.setValue('svar.etterlønn.svar', 'NEI');
                            formContext.setValue('svar.sykepenger.svar', 'NEI');
                            formContext.setValue('svar.institusjon.svar', 'NEI');
                            formContext.setValue('svar.mottarAndreUtbetalinger', 'NEI');
                            manuellSøknadHåndterPengestøtterSvar(formContext, 'NEI');
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
