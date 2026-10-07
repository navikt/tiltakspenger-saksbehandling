import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { useController, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { dateTilISOTekst } from '~/utils/date';

export const ManueltSattSøknadMottattDato = () => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();

    const { field, fieldState } = useController({
        name: 'manueltSattSøknadMottattDato',
        control,
        rules: {
            required: 'Dato for når søknaden ble mottatt er påkrevd.',
        },
    });

    return (
        <Datovelger
            label="Velg datoen søknaden ble mottatt"
            selected={field.value}
            maxDate={new Date()}
            onDateChange={(dato) => field.onChange(dato ? dateTilISOTekst(dato) : undefined)}
            error={fieldState.error?.message}
        />
    );
};
