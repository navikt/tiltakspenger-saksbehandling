import { IkkeSladdetVerdi, SladdbarVerdi, SladdetVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

export const SLADDET_TEKST_DEFAULT = '[Sladdet]';

export const erSladdet = <T>(verdi: SladdbarVerdi<T>): verdi is SladdetVerdi => verdi.erSladdet;

export function hentVerdi<T>(verdi: IkkeSladdetVerdi<T>): T;
export function hentVerdi<T>(verdi: SladdbarVerdi<T> | undefined): Nullable<T>;
export function hentVerdi<T>(verdi: SladdbarVerdi<T> | undefined): Nullable<T> {
    if (!verdi || verdi.erSladdet) {
        return null;
    }

    return verdi.verdi;
}

export const formaterSladdbarVerdi = <T>(
    verdi: SladdbarVerdi<T>,
    formater: (verdi: NonNullable<T>) => string,
    tomTekst: string = '',
    sladdetTekst: string = SLADDET_TEKST_DEFAULT,
): string => {
    if (erSladdet(verdi)) {
        return sladdetTekst;
    }

    return verdi.verdi === null || verdi.verdi === undefined ? tomTekst : formater(verdi.verdi);
};

export const sladdbarTekst = (
    verdi: SladdbarVerdi<Nullable<string>> | undefined,
    sladdetTekst: string = SLADDET_TEKST_DEFAULT,
): string => (verdi ? formaterSladdbarVerdi(verdi, (tekst) => tekst, '', sladdetTekst) : '');

export const sladdbarTekstEllerNull = (
    verdi: SladdbarVerdi<Nullable<string>> | undefined,
    sladdetTekst: string = SLADDET_TEKST_DEFAULT,
): Nullable<string> => {
    if (!verdi) {
        return null;
    }

    return erSladdet(verdi) ? sladdetTekst : verdi.verdi;
};
