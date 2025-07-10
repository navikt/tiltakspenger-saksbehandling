import {
    AntallDagerForMeldeperiode,
    Avslagsgrunn,
    BehandlingId,
    RevurderingResultat,
} from './BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';
import { BarnetilleggData, VedtakBarnetilleggDTO } from './Barnetillegg';

export type VedtakId = `vedtak_${string}`;

interface VedtakTilBeslutningBaseFelter {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
}

export interface VedtakTilBeslutningInnvilgelseDTO extends VedtakTilBeslutningBaseFelter {
    innvilgelsesperiode: Periode;
    barnetillegg: Nullable<VedtakBarnetilleggDTO>;
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    resultat: 'INNVILGELSE';
}

export interface VedtakTilBeslutningAvslagDTO extends VedtakTilBeslutningBaseFelter {
    avslagsgrunner: Avslagsgrunn[];
    resultat: 'AVSLAG';
}

export type VedtakTilBeslutningDTO =
    | VedtakTilBeslutningInnvilgelseDTO
    | VedtakTilBeslutningAvslagDTO;

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
        valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
        barnetillegg: VedtakBarnetilleggDTO | null;
        antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    };
};

export type VedtakRevurderingDTO = VedtakRevurderTilStansDTO | VedtakRevurderInnvilgelseDTO;

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
