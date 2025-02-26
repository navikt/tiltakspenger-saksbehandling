import { Periode } from './Periode';

export type VedtakResultat = 'innvilget' | 'avslag';

type VedtakFellesData = {
    begrunnelseVilkårsvurdering: string;
    fritekstTilVedtaksbrev: string;
    resultat?: VedtakResultat;
    innvilgelsesPeriode: Periode;
    barnetillegg?: unknown;
};

type Barnetillegg = {
    periode: Periode;
    antallBarn: number;
};

export type VedtakInnvilgetResultat = {
    resultat: 'innvilget';
    innvilgelsesPeriode: Periode;
};

export type VedtakAvslagResultat = {
    resultat: 'avslag';
};

export type VedtakUtenResultat = VedtakFellesData & {
    resultat?: undefined;
};

export type VedtakMedResultat = VedtakFellesData & (VedtakInnvilgetResultat | VedtakAvslagResultat);

export type VedtakData = VedtakUtenResultat | VedtakMedResultat;

export type VedtakTilBeslutterDTO = {
    fritekstTilVedtaksbrev: string;
    begrunnelseVilkårsvurdering: string;
    innvilgelsesperiode: Periode;
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

export type VedtakBarnetilleggDTO = {
    barnetilleggForPeriode: Barnetillegg;
    begrunnelse?: string;
};
