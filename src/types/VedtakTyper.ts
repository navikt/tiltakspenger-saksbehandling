import { Periode } from './Periode';

export type VedtakResultat = 'innvilget' | 'avslag';

export type VedtakInnvilgetResultat = {
    resultat: 'innvilget';
    innvilgelsesPeriode: Periode;
};

export type VedtakAvslagResultat = {
    resultat: 'avslag';
};

export type VedtakData = {
    begrunnelseVilkårsvurdering: string;
    fritekstTilVedtaksbrev: string;
    resultat?: VedtakResultat;
    innvilgelsesPeriode: Periode;
    barnetillegg?: VedtakBarnetillegg;
};

export type VedtakTilBeslutterDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    innvilgelsesperiode: Periode;
};

export type VedtakBarnetillegg = {
    barnetilleggForPeriode?: VedtakBarnetilleggPeriode[];
    begrunnelse?: string;
};

export type VedtakBarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type RevurderTilStansVedtak = {
    begrunnelse: string;
    stansDato: string;
};

export type VedtakBegrunnelseDTO = {
    begrunnelse: string;
};

export type VedtakBrevFritekstDTO = {
    fritekst: string;
};
