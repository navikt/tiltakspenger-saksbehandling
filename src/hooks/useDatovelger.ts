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
    fromDate: minDato,
    toDate: maxDato,
    defaultSelected: fraDato ? minDato : maxDato,
    defaultMonth: fraDato ? minDato : maxDato,
  });
