import { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

export function hookFormErrorsTilFeiloppsummering<T extends FieldValues>(
    errors: FieldErrors<T>,
): string[] {
    return Object.entries(errors)
        .flatMap(([key, value]) => {
            const v = value as FieldError | Array<FieldErrors<T[typeof key]>>;
            if (Array.isArray(v)) {
                return v.flatMap((x, index) => {
                    if (typeof x === 'undefined' || x === null) {
                        return [];
                    }
                    return hookFormErrorsTilFeiloppsummering(
                        withFullPathKeyNames(`${key}.${index}`, x),
                    );
                });
            }
            // Hvis vi ikke har 'type' eller 'message' så er det sannsynligvis et nøstet objekt med errors
            if (typeof v.type === 'undefined' && typeof v.message === 'undefined') {
                return hookFormErrorsTilFeiloppsummering(withFullPathKeyNames(key, v));
            }
            return v.message;
        })
        .filter((msg): msg is string => typeof msg === 'string');
}

const withFullPathKeyNames = (basePath: string, x: Record<string, unknown>) =>
    Object.entries(x).reduce(
        (acc, [k, v]) => ({
            ...acc,
            [`${basePath}.${k}`]: v,
        }),
        {},
    );
