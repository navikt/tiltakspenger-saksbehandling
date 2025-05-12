import { Avslagsgrunn, Behandlingsutfall } from './BehandlingTypes';
import { Nullable } from './common';
import { Periode } from './Periode';

export type VedtakTilBeslutningDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    behandlingsperiode: Periode;
    barnetillegg: VedtakBarnetilleggDTO | null;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiode: number;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
    utfall: Behandlingsutfall;
};

export type VedtakBarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type VedtakTiltaksdeltakelsePeriode = {
    eksternDeltagelseId: string;
    periode: Periode;
};

export type VedtakRevurderTilStansDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelse: string;
    stansDato: string;
    valgteHjemler: string[];
};

export type VedtakBegrunnelseLagringDTO = {
    begrunnelse: string;
};

export type VedtakBrevFritekstLagringDTO = {
    fritekst: string;
};

export type VedtakBarnetilleggDTO = {
    begrunnelse: string;
    perioder: VedtakBarnetilleggPeriode[];
};
