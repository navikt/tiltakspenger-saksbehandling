import { Periode } from './Periode';
import { VedtakBarnetilleggPeriode } from './VedtakTyper';

export type BarnetilleggData = {
    perioder: BarnetilleggPeriode[];
    begrunnelse?: string;
};

export type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type VedtakBarnetilleggDTO = {
    begrunnelse?: string;
    perioder: VedtakBarnetilleggPeriode[];
};
