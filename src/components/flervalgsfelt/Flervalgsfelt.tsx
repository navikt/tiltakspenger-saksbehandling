import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import { Select } from '@navikt/ds-react';
import { ValidatorFunction } from '../saksopplysning-tabell/Periodefelt';
import { setupValidation } from '../../utils/validation';

interface FlervalgsfeltProps {
  className?: string;
  label: string;
  size?: 'small' | 'medium';
  name: string;
  children: React.ReactNode | React.ReactNode[];
  validate?: ValidatorFunction | ValidatorFunction[];
}

const Flervalgsfelt = ({
  className,
  label,
  size,
  name,
  children,
  validate,
}: FlervalgsfeltProps) => {
  const { control, formState } = useFormContext();
  const errorMessage = get(formState.errors, name)?.message;
  return (
    <div id={name} className={className}>
      <Controller
        name={name}
        control={control}
        rules={{ validate: setupValidation(validate) }}
        render={({ field }) => {
          return (
            <Select label={label} size={size} error={errorMessage} {...field}>
              {children}
            </Select>
          );
        }}
      />
    </div>
  );
};

export default Flervalgsfelt;
