import {
  ErrorMessage,
  DatePicker,
  useDatepicker,
  HStack,
} from '@navikt/ds-react';
import React, { useState } from 'react';

export interface PeriodevelgerPeriode {
  fom?: Date;
  tom?: Date;
}

export interface RangeError {
  from?: string;
  to?: string;
}

interface PeriodevelgerProps {
  onFromChange: (date: Date | undefined) => void;
  onToChange: (date: Date | undefined) => void;
  defaultSelected?: PeriodevelgerPeriode | null;
  errorMessage?: string;
  id?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledFra?: boolean;
  disabledTil?: boolean;
}

export default function Periodevelger({
  onFromChange,
  onToChange,
  defaultSelected,
  errorMessage,
  id,
  minDate,
  maxDate,
  disabledFra,
  disabledTil,
}: PeriodevelgerProps) {
  const [rangeError, setRangeError] = useState<RangeError>({});
  const fromDatePicker = useDatepicker({
    onDateChange: (date) => {
      onFromChange(date);
    },
    defaultSelected: defaultSelected?.fom,
    fromDate: minDate,
    toDate: maxDate,
    defaultMonth: minDate ?? maxDate,
    onValidate: (validation) => {
      if (validation.isBefore || validation.isAfter) {
        setRangeError({
          from: 'Fra-dato kan ikke være utenfor behandlingsperioden',
        });
      } else {
        setRangeError({ ...rangeError, from: undefined });
      }
    },
  });

  const toDatePicker = useDatepicker({
    onDateChange: (date) => {
      onToChange(date);
    },
    defaultSelected: defaultSelected?.tom,
    fromDate: minDate,
    toDate: maxDate,
    defaultMonth: maxDate ?? minDate,
    onValidate: (validation) => {
      if (validation.isBefore || validation.isAfter) {
        setRangeError({
          to: 'Til-dato kan ikke være utenfor behandlingsperioden',
        });
      } else {
        setRangeError({ ...rangeError, to: undefined });
      }
    },
  });

  const computedError = rangeError?.from || rangeError?.to || errorMessage;

  return (
    <>
      <HStack gap="5">
        <DatePicker {...fromDatePicker.datepickerProps} id={`${id}`}>
          <DatePicker.Input
            {...fromDatePicker.inputProps}
            label="Fra"
            error={!!computedError}
            disabled={disabledFra}
            aria-label={`${id}.fra`}
            autoComplete="off"
          />
        </DatePicker>
        <DatePicker {...toDatePicker.datepickerProps} id={`${id}`}>
          <DatePicker.Input
            {...toDatePicker.inputProps}
            label="Til"
            error={!!computedError}
            disabled={disabledTil}
            aria-label={`${id}.til`}
            autoComplete="off"
          />
        </DatePicker>
      </HStack>
      {computedError ? <ErrorMessage>{`• ${computedError}`}</ErrorMessage> : ''}
    </>
  );
}
