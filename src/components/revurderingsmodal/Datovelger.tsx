import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { ComponentProps } from 'react';

type Props = {
    onDateChange: (date: Date | undefined) => void;
    minDate?: Date;
    maxDate?: Date;
    defaultSelected: Date;
} & ComponentProps<typeof DatePicker.Input>;

export const Datovelger = ({
    onDateChange,
    maxDate,
    minDate,
    defaultSelected,
    ...inputPropsCustom
}: Props) => {
    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange,
        fromDate: minDate,
        defaultMonth: minDate,
        toDate: maxDate,
        defaultSelected: defaultSelected,
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} {...inputPropsCustom} />
        </DatePicker>
    );
};
