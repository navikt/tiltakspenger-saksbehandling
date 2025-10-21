import { Periode } from './Periode';
import { Nullable } from './UtilTypes';

export type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type Barnetillegg = {
    perioder: BarnetilleggPeriode[];
    begrunnelse: Nullable<string>;
};
