import { Nullable } from '~/types/UtilTypes';
import { Dato } from '~/types/DatoTid';

export type Periode = {
    fraOgMed: Dato;
    tilOgMed: Dato;
};

/**
 * Periode der start- og/eller sluttdato kan mangle.
 */
export type ÅpenPeriode = {
    fraOgMed: Nullable<Dato>;
    tilOgMed: Nullable<Dato>;
};

export type MedPeriode<T = unknown> = T & {
    periode: Periode;
};
