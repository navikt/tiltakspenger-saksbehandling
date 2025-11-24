export type Periode = {
    fraOgMed: string;
    tilOgMed: string;
};

export type MedPeriode<T = unknown> = T & {
    periode: Periode;
};
