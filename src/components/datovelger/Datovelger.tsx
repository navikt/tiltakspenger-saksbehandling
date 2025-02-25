import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { ComponentProps } from 'react';

type DateOrString = Date | string;

type Props = {
    onDateChange: (date: Date | undefined) => void;
    defaultSelected: DateOrString;
    minDate?: DateOrString;
    maxDate?: DateOrString;
} & ComponentProps<typeof DatePicker.Input>;

export const Datovelger = ({
    onDateChange,
    defaultSelected,
    maxDate,
    minDate,
    ...inputPropsCustom
}: Props) => {
    const { datepickerProps, inputProps } = useDatepicker({
        onDateChange,
        fromDate: toDate(minDate),
        defaultMonth: toDate(minDate),
        toDate: toDate(maxDate),
        defaultSelected: toDate(defaultSelected),
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} {...inputPropsCustom} />
        </DatePicker>
    );
};

const toDate = (date?: DateOrString): Date | undefined =>
    date ? (date instanceof Date ? date : new Date(date)) : undefined;
