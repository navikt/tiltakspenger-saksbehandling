import { Nullable } from '~/types/UtilTypes';

export type Periode = {
    fraOgMed: string;
    tilOgMed: string;
};

/**
 * Periode der start- og/eller sluttdato kan mangle.
 */
export type ÅpenPeriode = {
    fraOgMed: Nullable<string>;
    tilOgMed: Nullable<string>;
};

export type MedPeriode<T = unknown> = T & {
    periode: Periode;
};
