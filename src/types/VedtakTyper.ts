import { Periode } from './Periode';

export type VedtakResultat = 'innvilget' | 'avslag';

export type VedtakInnvilgetResultat = {
    resultat: 'innvilget';
    innvilgelsesPeriode: Periode;
};

export type VedtakAvslagResultat = {
    resultat: 'avslag';
};

export type VedtakTilBeslutningDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    innvilgelsesperiode: Periode;
    barnetillegg: {
        begrunnelse?: string;
        perioder?: VedtakBarnetilleggPeriode[];
    } | null;
};

export type VedtakBarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type VedtakRevurderTilStansDTO = {
    begrunnelse: string;
    stansDato: string;
};

export type VedtakBegrunnelseLagringDTO = {
    begrunnelse: string;
};

export type VedtakBrevFritekstLagringDTO = {
    fritekst: string;
};

export type VedtakBarnetilleggBegrunnelseLagringDTO = {
    begrunnelse: string;
    barnetilleggForPeriode: VedtakBarnetilleggPeriode[];
};
