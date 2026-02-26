export type ArrayOrSingle<T> = T | T[];

export type Nullable<T> = T | null;

export type PartialRecord<K extends string | number | symbol, V> = { [key in K]?: V };
