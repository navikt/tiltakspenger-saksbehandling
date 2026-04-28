import { Periode } from '../../../types/Periode';
import { Nullable } from '../../../types/UtilTypes';

export type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type Barnetillegg = {
    perioder: BarnetilleggPeriode[];
    begrunnelse: Nullable<string>;
};
