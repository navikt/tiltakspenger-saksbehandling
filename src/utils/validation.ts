import dayjs from 'dayjs';

export type ValidatorFunction = (value: any) => string | undefined;

export function påkrevdPeriodeValidator(periode: { fra: Date; til: Date }) {
  if (!periode?.fra || !periode?.til) {
    return 'Fra og til må fylles ut';
  }
}

export function gyldigPeriodeValidator(periode: { fra: Date; til: Date }) {
  const fraDato = dayjs(periode?.fra);
  const tilDato = dayjs(periode?.til);

  if (fraDato.isAfter(tilDato)) {
    return 'Fra-dato kan ikke være etter til-dato';
  }
}

export function validatorArrayAsObject(validate: ValidatorFunction[]) {
  const validateObject: { [key: string]: ValidatorFunction } = {};
  validate.forEach(
    (validatorFunction, index) =>
      (validateObject[`${index}`] = validatorFunction),
  );
  return validateObject;
}

export function setupValidation(
  validate?: ValidatorFunction | ValidatorFunction[],
) {
  if (Array.isArray(validate)) {
    return validatorArrayAsObject(validate);
  }
  return validate;
}
