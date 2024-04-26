import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import Periodevelger from './PeriodeVelger';
import { setupValidation } from '../../utils/validation';

export type ValidatorFunction = (value: any) => string | undefined;

interface PeriodeSkjemaProps {
  name: string;
  validate?: ValidatorFunction | ValidatorFunction[];
  minDate?: Date;
  maxDate?: Date;
  disabledFra?: boolean;
  disabledTil?: boolean;
  defaultFra?: Date;
  defaultTil?: Date;
  size?: 'medium' | 'small';
}

export default function Periodefelt({
  name,
  validate,
  minDate,
  maxDate,
  disabledTil,
  disabledFra,
  defaultFra,
  defaultTil,
  size,
}: PeriodeSkjemaProps) {
  const { control, formState, getValues } = useFormContext();
  const errorMessage = get(formState.errors, name)?.message;
  return (
    <div id={name}>
      <Controller
        name={name}
        control={control}
        rules={{ validate: setupValidation(validate) }}
        render={({ field: { onChange } }) => {
          return (
            <Periodevelger
              id={name}
              onFromChange={(date) => {
                onChange({
                  fom: date || '',
                  tom: getValues(`${name}.tom`),
                });
              }}
              onToChange={(date) => {
                onChange({
                  fom: getValues(`${name}.fom`),
                  tom: date || '',
                });
              }}
              defaultSelected={{
                fom: defaultFra,
                tom: defaultTil,
              }}
              errorMessage={errorMessage}
              minDate={minDate}
              maxDate={maxDate}
              disabledFra={disabledFra}
              disabledTil={disabledTil}
              size={size}
            />
          );
        }}
      />
    </div>
  );
}
