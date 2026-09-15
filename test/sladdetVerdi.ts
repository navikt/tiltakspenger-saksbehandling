import { IkkeSladdetVerdi, SladdetVerdi } from '~/types/SladdetVerdi';

/**
 * Konstruktører for sladdbare verdier. Backenden lager verdiene i produksjon,
 * så disse er kun ment for testdata og er ikke en del av appbygget.
 */

export const sladdet: SladdetVerdi = { verdi: null, erSladdet: true };

export const ikkeSladdet = <T>(verdi: T): IkkeSladdetVerdi<T> => ({ verdi, erSladdet: false });
