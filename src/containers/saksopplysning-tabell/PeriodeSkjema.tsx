import React from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';
import Periodevelger from './PeriodeVelger';

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
}

function validatorArrayAsObject(validate: ValidatorFunction[]) {
    const validateObject: { [key: string]: ValidatorFunction } = {};
    validate.forEach((validatorFunction, index) => (validateObject[`${index}`] = validatorFunction));
    return validateObject;
}

function setupValidation(validate?: ValidatorFunction | ValidatorFunction[]) {
    if (Array.isArray(validate)) {
        return validatorArrayAsObject(validate);
    }
    return validate;
}

export default function PeriodeSkjema({
    name,
    validate,
    minDate,
    maxDate,
    disabledTil,
    disabledFra,
    defaultFra,
    defaultTil,
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
                        />
                    );
                }}
            />
        </div>
    );
}
