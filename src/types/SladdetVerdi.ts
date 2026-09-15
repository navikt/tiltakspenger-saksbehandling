import { Nullable } from '~/types/UtilTypes';

/** Teksten sladdede verdier vises som i flaten. Backenden sender aldri denne teksten. */
export const SLADDET_TEKST = '[Sladdet]';

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

export const sladdet: SladdetVerdi = { verdi: null, erSladdet: true };

export const ikkeSladdet = <T>(verdi: T): IkkeSladdetVerdi<T> => ({ verdi, erSladdet: false });

export const erSladdet = <T>(verdi: SladdbarVerdi<T>): verdi is SladdetVerdi => verdi.erSladdet;

export const hentVerdi = <T>(verdi: SladdbarVerdi<T> | undefined): Nullable<T> =>
    verdi?.verdi ?? null;

export const formaterSladdbarVerdi = <T>(
    verdi: SladdbarVerdi<T>,
    formater: (verdi: NonNullable<T>) => string,
    tomTekst: string = '',
): string => {
    if (erSladdet(verdi)) {
        return SLADDET_TEKST;
    }

    return verdi.verdi === null || verdi.verdi === undefined ? tomTekst : formater(verdi.verdi);
};

export const sladdbarTekst = (verdi: SladdbarVerdi<Nullable<string>> | undefined): string =>
    verdi ? formaterSladdbarVerdi(verdi, (tekst) => tekst) : '';

export const sladdbarTekstEllerNull = (
    verdi: SladdbarVerdi<Nullable<string>> | undefined,
): Nullable<string> => {
    if (!verdi) {
        return null;
    }

    return erSladdet(verdi) ? SLADDET_TEKST : verdi.verdi;
};
