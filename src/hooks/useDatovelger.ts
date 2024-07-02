import { useDatepicker } from '@navikt/ds-react';

export const useDatovelger = (
  onDatoChange: (dato: Date) => void,
  minDato: Date,
  maxDato: Date,
  fraDato: boolean,
) =>
  useDatepicker({
    onDateChange: (date) => {
      if (!date) return;
      onDatoChange(date);
    },
    fromDate: new Date(minDato),
    toDate: new Date(maxDato),
    defaultMonth: fraDato ? minDato : maxDato,
  });
