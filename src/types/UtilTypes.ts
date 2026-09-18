export type ArrayOrSingle<T> = T | T[];

export type Nullable<T> = T | null;

export type PartialRecord<K extends string | number | symbol, V> = { [key in K]?: V };

// Brand feltet eksisterer ikke runtime, men brukes for å lure type-systemet til å skille typer av T som ellers ville vært ekvivalente
export type Branded<T, Brand extends string> = T & { readonly [K in Brand]: void };
