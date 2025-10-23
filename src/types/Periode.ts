import { Nullable } from './UtilTypes';

export type Periode = {
    fraOgMed: string;
    tilOgMed: string;
};

export interface PeriodeMedNullable {
    fraOgMed: Nullable<string>;
    tilOgMed: Nullable<string>;
}
