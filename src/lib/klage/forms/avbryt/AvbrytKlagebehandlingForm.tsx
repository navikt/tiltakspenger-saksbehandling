import { Select, Textarea, VStack } from '@navikt/ds-react';
import { Control, Controller, useWatch } from 'react-hook-form';
import {
    AvbrytKlagebehandlingFormStatus,
    avbrytKlagebehandlingFormStatusLabels,
    AvbrytKlagebehandlingFormData,
} from './AvbrytKlagebehandlingFormUtils';

const AvbrytKlagebehandlingForm = (props: { control: Control<AvbrytKlagebehandlingFormData> }) => {
    const status = useWatch({
        control: props.control,
        name: 'status',
    });

    return (
        <VStack gap="space-16" padding="space-24">
            <Controller
                name="status"
                control={props.control}
                render={({ field, fieldState }) => (
                    <Select label="Status" {...field} error={fieldState?.error?.message}>
                        <option value="">Velg status</option>
                        {Object.values(AvbrytKlagebehandlingFormStatus).map((status) => (
                            <option key={status} value={status}>
                                {avbrytKlagebehandlingFormStatusLabels[status]}
                            </option>
                        ))}
                    </Select>
                )}
            />

            {status === AvbrytKlagebehandlingFormStatus.ANNET && (
                <Controller
                    name="begrunnelse"
                    control={props.control}
                    render={({ field, fieldState }) => (
                        <Textarea
                            label="Begrunnelse (obligatorisk)"
                            {...field}
                            error={fieldState?.error?.message}
                        />
                    )}
                />
            )}
        </VStack>
    );
};

export default AvbrytKlagebehandlingForm;
