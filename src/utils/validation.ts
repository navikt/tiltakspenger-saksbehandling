import dayjs from 'dayjs';
import { ValidatorFunction } from '../components/saksopplysning-tabell/Periodefelt';

export function påkrevdPeriodeValidator(periode: { fom: Date; tom: Date }) {
  if (!periode?.fom || !periode?.tom) {
    return 'Fra og til må fylles ut';
  }
}

export function gyldigPeriodeValidator(periode: { fom: Date; tom: Date }) {
  const fraDato = dayjs(periode?.fom);
  const tilDato = dayjs(periode?.tom);

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
