import { Avslagsgrunn, Behandlingsutfall, RevurderingType } from './BehandlingTypes';
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

type VedtakRevurderingDTO = {
    type: RevurderingType;
    begrunnelse: string;
    fritekstTilVedtaksbrev: string;
};

export type VedtakRevurderTilStansDTO = VedtakRevurderingDTO & {
    type: RevurderingType.STANS;
    stans: {
        valgteHjemler: string[];
        stansFraOgMed: string;
    };
};

export type VedtakRevurderInnvilgelseDTO = VedtakRevurderingDTO & {
    type: RevurderingType.INNVILGELSE;
    innvilgelse: {
        innvilgelsesperiode: Periode;
    };
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

export type VedtakOpprettRevurderingDTO = {
    revurderingType: RevurderingType;
};
