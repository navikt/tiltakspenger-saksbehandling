import {
    AntallDagerForMeldeperiode,
    Avslagsgrunn,
    BehandlingId,
    RevurderingResultat,
} from './BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';
import { BarnetilleggData, BarnetilleggPeriode, VedtakBarnetilleggDTO } from './Barnetillegg';

export type VedtakId = `vedtak_${string}`;

export enum BehandlingResultatDTO {
    AVSLAG = 'AVSLAG',
    INNVILGELSE = 'INNVILGELSE',
    IKKE_VALGT = 'IKKE_VALGT',
    STANS = 'STANS',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
}

interface BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO;
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
}

export interface SøknadsbehandlingVedtakInnvilgelseDTO extends BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO.INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
}

export interface SøknadsbehandlingVedtakAvslagDTO extends BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
}

export interface SøknadsbehandlingVedtakIkkeValgtDTO extends BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO.IKKE_VALGT;
}

export type SøknadsbehandlingVedtakDTO =
    | SøknadsbehandlingVedtakInnvilgelseDTO
    | SøknadsbehandlingVedtakAvslagDTO
    | SøknadsbehandlingVedtakIkkeValgtDTO;

export interface RevurderingVedtakStansDTO extends BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO.STANS;
    valgteHjemler: string[];
    stansFraOgMed: string;
}

export interface RevurderingVedtakInnvilgelseDTO extends BehandlingVedtakBaseDTO {
    resultat: BehandlingResultatDTO.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
}

export type RevurderingVedtakDTO = RevurderingVedtakStansDTO | RevurderingVedtakInnvilgelseDTO;

export type BehandlingVedtakDTO = SøknadsbehandlingVedtakDTO | RevurderingVedtakDTO;

export type VedtakBarnetilleggPeriode = BarnetilleggPeriode;

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
