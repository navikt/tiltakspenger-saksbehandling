import { Branded } from '~/types/UtilTypes';

export type Dato = Branded<string, 'dato'>;

export type Tidspunkt = Branded<string, 'tidspunkt'>;

export const erDato = (s: string): s is Dato => /^\d{4}-\d{2}-\d{2}$/.test(s);

export const tilDato = (s: string): Dato => {
    if (!erDato(s)) {
        throw new Error(`Ugyldig dato: ${s}`);
    }
    return s;
};

export const erTidspunkt = (s: string): s is Tidspunkt =>
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?$/.test(s);

export const tilTidspunkt = (s: string): Tidspunkt => {
    if (!erTidspunkt(s)) {
        throw new Error(`Ugyldig tidspunkt: ${s}`);
    }
    return s;
};
