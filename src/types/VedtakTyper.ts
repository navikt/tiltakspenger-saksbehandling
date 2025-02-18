import { Periode } from './Periode';

export type VedtakResultat = 'innvilget' | 'avslag' | undefined;

type VedtakFellesData = {
    begrunnelseVilkårsvurdering: string;
    fritekstTilVedtaksbrev: string;
};

export type VedtakInnvilgetResultat = {
    resultat: 'innvilget';
    innvilgetPeriode: Periode;
};

export type VedtakAvslagResultat = {
    resultat: 'avslag';
};

type VedtakUtenResultat = VedtakFellesData & {
    resultat: undefined;
};

type VedtakMedResultat = VedtakFellesData & (VedtakInnvilgetResultat | VedtakAvslagResultat);

export type VedtakData = VedtakUtenResultat | VedtakMedResultat;
