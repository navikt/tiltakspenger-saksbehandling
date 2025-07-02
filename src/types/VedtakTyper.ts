import {
    AntallDagerForMeldeperiode,
    Avslagsgrunn,
    BarnetilleggData,
    BehandlingId,
    BehandlingResultat,
    RevurderingResultat,
} from './BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from './Periode';

export type VedtakId = `vedtak_${string}`;

export type VedtakTilBeslutningDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    behandlingsperiode: Periode;
    barnetillegg: VedtakBarnetilleggDTO | null;
    valgteTiltaksdeltakelser: VedtakTiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: Nullable<AntallDagerForMeldeperiode[]>;
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

export type VedtakBarnetilleggDTO = {
    begrunnelse: string;
    perioder: VedtakBarnetilleggPeriode[];
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
