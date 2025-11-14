import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { ComponentProps, useEffect } from 'react';

export type DateOrString = Date | string;

type Props = {
    onDateChange: (date: Date | undefined) => void;
    defaultSelected?: DateOrString;
    selected?: DateOrString;
    minDate?: DateOrString;
    maxDate?: DateOrString;
} & ComponentProps<typeof DatePicker.Input>;

export const Datovelger = ({
    onDateChange,
    defaultSelected,
    selected,
    maxDate,
    minDate,
    ...inputPropsCustom
}: Props) => {
    const { datepickerProps, inputProps, setSelected, selectedDay } = useDatepicker({
        onDateChange,
        fromDate: toDate(minDate),
        defaultMonth: toDate(minDate),
        toDate: toDate(maxDate),
        defaultSelected: toDate(defaultSelected),
    });

    useEffect(() => {
        const newSelectedDay = toDate(selected);

        // Oppdaterer ikke når verdien ikke endres, for å hindre infinite loop i noen tilfeller ved bruk som controlled component
        if (newSelectedDay && newSelectedDay.getTime() !== selectedDay?.getTime()) {
            setSelected(newSelectedDay);
        }
    }, [selected]);

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} {...inputPropsCustom} />
        </DatePicker>
    );
};

const toDate = (date?: DateOrString): Date | undefined =>
    date ? (date instanceof Date ? date : new Date(date)) : undefined;
