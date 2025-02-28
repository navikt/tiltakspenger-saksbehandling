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

export type VedtakBarnetilleggBegrunnelseDTO = {
    begrunnelse: string;
    barnetilleggForPeriode: VedtakBarnetilleggPeriode[];
};
