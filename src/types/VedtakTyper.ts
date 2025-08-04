import {
    AntallDagerForMeldeperiode,
    Avslagsgrunn,
    BehandlingId,
    BehandlingResultat,
    RevurderingResultat,
    SøknadsbehandlingResultat,
} from './BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';
import { BarnetilleggData, VedtakBarnetilleggDTO } from './Barnetillegg';

export type VedtakId = `vedtak_${string}`;

interface BehandlingVedtakBaseDTO {
    resultat: BehandlingResultat;
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
}

export interface SøknadsbehandlingVedtakInnvilgelseDTO extends BehandlingVedtakBaseDTO {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
}

export interface SøknadsbehandlingVedtakAvslagDTO extends BehandlingVedtakBaseDTO {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
}

export type SøknadsbehandlingVedtakDTO =
    | SøknadsbehandlingVedtakInnvilgelseDTO
    | SøknadsbehandlingVedtakAvslagDTO;

export interface RevurderingVedtakStansDTO extends BehandlingVedtakBaseDTO {
    resultat: RevurderingResultat.STANS;
    valgteHjemler: string[];
    stansFraOgMed: string;
}

export interface RevurderingVedtakInnvilgelseDTO extends BehandlingVedtakBaseDTO {
    resultat: RevurderingResultat.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
}

export type RevurderingVedtakDTO = RevurderingVedtakStansDTO | RevurderingVedtakInnvilgelseDTO;

export type VedtakBarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type VedtakTiltaksdeltakelsePeriode = {
    eksternDeltagelseId: string;
    periode: Periode;
};

export type VedtakBegrunnelseLagringDTO = {
    begrunnelse: string;
};

export type VedtakBrevFritekstLagringDTO = {
    fritekst: string;
};

export type VedtakOpprettRevurderingDTO = {
    revurderingType: RevurderingResultat;
};

export enum Vedtakstype {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    STANS = 'STANS',
}

export type Rammevedtak = {
    id: VedtakId;
    behandlingId: BehandlingId;
    opprettet: string;
    vedtaksdato: Nullable<string>;
    vedtaksType: Vedtakstype;
    periode: Periode;
    saksbehandler: string;
    beslutter: string;
    // TODO jah: Denne blir en periodisering. På samme måte som behandlingen. Brukes for å vises i tidslinja.
    antallDagerPerMeldeperiode: number;
    barnetillegg: Nullable<BarnetilleggData>;
};
