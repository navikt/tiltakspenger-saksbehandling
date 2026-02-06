import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { ComponentProps, useEffect } from 'react';
import { DateOrString, tilDate } from '~/utils/date';
import { Periode } from '~/types/Periode';

type MatcherProps = ComponentProps<typeof DatePicker>['disabled'];

export type DatovelgerProps = {
    onDateChange: (date: Date | undefined) => void;
    defaultSelected?: DateOrString;
    selected?: DateOrString;
    minDate?: DateOrString;
    maxDate?: DateOrString;
    defaultMonth?: DateOrString;
    label?: React.ReactNode;
    dropdownCaption?: boolean;
    disabledMatcher?: MatcherProps;
} & Omit<ComponentProps<typeof DatePicker.Input>, 'label'>;

export const Datovelger = ({
    onDateChange,
    defaultSelected,
    selected,
    maxDate,
    minDate,
    defaultMonth,
    label,
    dropdownCaption,
    disabledMatcher,
    ...inputPropsCustom
}: DatovelgerProps) => {
    const { datepickerProps, inputProps, setSelected, selectedDay } = useDatepicker({
        onDateChange,
        fromDate: tilDate(minDate),
        defaultMonth: tilDate(defaultMonth ?? minDate),
        toDate: tilDate(maxDate),
        defaultSelected: tilDate(defaultSelected),
    });

    useEffect(() => {
        const newSelectedDay = tilDate(selected);

        // Oppdaterer ikke når verdien ikke endres, for å hindre infinite loop i noen tilfeller ved bruk som controlled component
        if (newSelectedDay && newSelectedDay.getTime() !== selectedDay?.getTime()) {
            setSelected(newSelectedDay);
        }
    }, [selected]);

    return (
        <DatePicker
            {...datepickerProps}
            dropdownCaption={dropdownCaption}
            disabled={disabledMatcher}
            fixedWeeks={true}
        >
            <DatePicker.Input {...inputProps} {...inputPropsCustom} label={label ?? 'Velg dato'} />
        </DatePicker>
    );
};

export const generateMatcherProps = (perioder: Periode[]): MatcherProps => {
    return perioder.length > 0
        ? perioder.map((p) => {
              return {
                  from: tilDate(p.fraOgMed),
                  to: tilDate(p.tilOgMed),
              };
          })
        : undefined;
};
