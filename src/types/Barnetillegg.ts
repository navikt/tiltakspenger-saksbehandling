import { AntallDagerForMeldeperiode } from './BehandlingTypes';
import { Periode } from './Periode';
import { Nullable } from './UtilTypes';
import { VedtakBarnetilleggPeriode, VedtakTiltaksdeltakelsePeriode } from './VedtakTyper';

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

export interface OppdaterBarnetilleggRequest {
    innvilgelsesperiode: Periode;
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
}
