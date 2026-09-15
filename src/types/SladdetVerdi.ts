export type SladdetVerdi = {
    verdi: null;
    erSladdet: true;
};

export type IkkeSladdetVerdi<T> = {
    verdi: T;
    erSladdet: false;
};

/**
 * Verdier backenden sladder for saksbehandlere uten fagrolle.
 * Feltet selv er aldri null - en verdi som mangler er `{ verdi: null, erSladdet: false }`,
 * og skiller seg dermed fra en sladdet verdi. Motstykket i backenden heter `SladdbarVerdi<T>`.
 */
export type SladdbarVerdi<T> = SladdetVerdi | IkkeSladdetVerdi<T>;
