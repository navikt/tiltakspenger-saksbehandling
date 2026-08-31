export const isValueInRecord = <T extends Record<string, unknown>>(
    value: unknown,
    record: T,
): value is T[keyof T] => Object.values(record).includes(value);

export const isNonNullish = <T>(value: T): value is Exclude<T, null | undefined> =>
    value !== null && value !== undefined;

export const nonNullish = <T>(
    value: T,
    msg: string = 'Verdien kan ikke være null eller undefined',
): Exclude<T, null | undefined> => {
    if (!isNonNullish(value)) {
        throw Error(`${msg} (verdi: ${value})`);
    }

    return value;
};
