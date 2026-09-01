import { nonNullish } from '~/utils/object';

declare global {
    interface Array<T> {
        atNonNull(index: number, msg?: string): NonNullable<T>;
    }

    interface ReadonlyArray<T> {
        atNonNull(index: number, msg?: string): NonNullable<T>;
    }
}

// Som Array.prototype.at, men kaster en feil dersom indeksen ikke finnes i arrayet
Array.prototype.atNonNull = function <T>(
    this: T[],
    index: number,
    msg: string = 'Verdien kan ikke være null eller undefined',
): NonNullable<T> {
    return nonNullish(
        this.at(index),
        `${msg} (${index} out of bounds, length: ${this.length})`,
    ) as NonNullable<T>;
};
