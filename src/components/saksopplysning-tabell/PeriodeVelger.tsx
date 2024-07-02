import { DatePicker, ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { useDatovelger } from '../../hooks/useDatovelger';

interface PeriodevelgerProps {
  onFraChange: (dato: Date) => void;
  onTilChange: (dato: Date) => void;
  minDato: string;
  maxDato: string;
  valgtFraDato: Date;
  valgtTilDato: Date;
  disabled: boolean;
  error: string;
}

export default function Periodevelger({
  onFraChange,
  onTilChange,
  minDato,
  maxDato,
  valgtFraDato,
  valgtTilDato,
  disabled,
  error,
}: PeriodevelgerProps) {
  const fraDatovelger = useDatovelger(
    onFraChange,
    new Date(minDato),
    new Date(maxDato),
    true,
  );
  const tilDatovelger = useDatovelger(
    onTilChange,
    new Date(minDato),
    new Date(maxDato),
    false,
  );

  useEffect(() => {
    fraDatovelger.setSelected(valgtFraDato);
    tilDatovelger.setSelected(valgtTilDato);
  }, [valgtFraDato, valgtTilDato, fraDatovelger, tilDatovelger]);

  return (
    <VStack>
      <HStack gap="5">
        <DatePicker
          {...fraDatovelger.datepickerProps}
          aria-label="Velg fra-dato"
          dropdownCaption
        >
          <DatePicker.Input
            {...fraDatovelger.inputProps}
            label="Fra"
            autoComplete="off"
            disabled={disabled}
          />
        </DatePicker>
        <DatePicker
          {...tilDatovelger.datepickerProps}
          aria-label="Velg til-dato"
          dropdownCaption
        >
          <DatePicker.Input
            {...tilDatovelger.inputProps}
            label="Til"
            autoComplete="off"
            disabled={disabled}
          />
        </DatePicker>
      </HStack>
      {error && <ErrorMessage>{`• ${error}`}</ErrorMessage>}
    </VStack>
  );
}
