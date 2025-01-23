import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { useState } from 'react';

interface DatovelgerProps {
    onDateChange?: (date: Date | undefined) => void;
    errorMessage?: string;
    minDate?: Date;
    maxDate?: Date;
    label: string;
    defaultSelected: Date;
    readOnly?: boolean;
}
export default function Datovelger({
    onDateChange,
    errorMessage,
    label,
    maxDate,
    minDate,
    defaultSelected,
    readOnly = false,
}: DatovelgerProps) {
    const [dateError, setDateError] = useState<string>('');

    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange,
        fromDate: minDate,
        defaultMonth: minDate,
        toDate: maxDate,
        defaultSelected: defaultSelected,
    });

    const computedError = dateError || errorMessage;

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                label={label}
                error={computedError}
                readOnly={readOnly}
            />
        </DatePicker>
    );
}
