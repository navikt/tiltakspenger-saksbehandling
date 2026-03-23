export const valueIsInRecord = <T extends Record<string, unknown>>(
    value: unknown,
    record: T,
): value is T[keyof T] => Object.values(record).includes(value);
