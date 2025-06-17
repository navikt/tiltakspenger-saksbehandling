import { Avslagsgrunn, BehandlingResultat, RevurderingResultat } from './BehandlingTypes';
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
    resultat: BehandlingResultat;
};

export type VedtakBarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type VedtakTiltaksdeltakelsePeriode = {
    eksternDeltagelseId: string;
    periode: Periode;
};

type VedtakRevurderingBaseDTO = {
    type: RevurderingResultat;
    begrunnelse: string;
    fritekstTilVedtaksbrev: string;
};

export type VedtakRevurderTilStansDTO = VedtakRevurderingBaseDTO & {
    type: RevurderingResultat.STANS;
    stans: {
        valgteHjemler: string[];
        stansFraOgMed: string;
    };
};

export type VedtakRevurderInnvilgelseDTO = VedtakRevurderingBaseDTO & {
    type: RevurderingResultat.REVURDERING_INNVILGELSE;
    innvilgelse: {
        innvilgelsesperiode: Periode;
    };
};

export type VedtakRevurderingDTO = VedtakRevurderTilStansDTO | VedtakRevurderInnvilgelseDTO;

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
    revurderingType: RevurderingResultat;
};
