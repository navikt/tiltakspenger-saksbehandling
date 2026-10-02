import { FieldErrors, FieldValues, ResolverResult } from 'react-hook-form';

// react-hook-form krever at en resolver returnerer enten verdiene uten feil, eller feilene uten verdier.
export const resolverResultat = <T extends FieldValues>(
    values: T,
    errors: FieldErrors<T>,
): ResolverResult<T> =>
    Object.keys(errors).length > 0 ? { values: {}, errors } : { values, errors: {} };
