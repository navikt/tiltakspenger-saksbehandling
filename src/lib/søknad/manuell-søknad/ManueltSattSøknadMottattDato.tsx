import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { JaNeiSvar } from '~/lib/søknad/søknadTyper';
import { dateTilISOTekst } from '~/utils/date';

// Ved overføring fra Arena setter backend mottatt-dato fra journalposten, så feltet er irrelevant.
export const ManueltSattSøknadMottattDato = () => {
    const { control } = useFormContext<ManueltRegistrertSøknad>();
    const overførtFraArenaSvar = useWatch({ control, name: 'overfortFraArena' }) as
        JaNeiSvar | undefined;

    return overførtFraArenaSvar === 'JA' ? null : <MottattDatovelger />;
};

// Egen komponent slik at controlleren avmonteres når feltet skjules, og dermed ikke valideres.
const MottattDatovelger = () => {
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
