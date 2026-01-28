import { Barnetillegg } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingRequestBase,
    RammebehandlingBase,
} from './Rammebehandling';
import { Nullable } from './UtilTypes';
import { VedtakId } from './Rammevedtak';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

interface RevurderingBase extends RammebehandlingBase {
    type: Rammebehandlingstype.REVURDERING;
    resultat: RevurderingResultat;
}

export type Revurdering = RevurderingStans | RevurderingInnvilgelse | RevurderingOmgjøring;

export interface RevurderingStans extends RevurderingBase {
    resultat: RevurderingResultat.STANS;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingInnvilgelse extends RevurderingBase {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
}

export interface RevurderingOmgjøring extends RevurderingBase {
    resultat: RevurderingResultat.OMGJØRING;
    vedtaksperiode: Periode;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    omgjørVedtak: VedtakId;
    harValgtSkalOmgjøreHeleVedtaksperioden: boolean;
    valgtOmgjøringsperiode: Nullable<Periode>;
}

export enum RevurderingResultat {
    STANS = 'STANS',
    INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING = 'OMGJØRING',
}

export type RevurderingVedtakStansRequest = OppdaterBehandlingRequestBase & {
    resultat: RevurderingResultat.STANS;
    valgteHjemler: HjemmelForStans[];
} & (
        | {
              stansFraOgMed: null;
              harValgtStansFraFørsteDagSomGirRett: true;
          }
        | {
              stansFraOgMed: string;
              harValgtStansFraFørsteDagSomGirRett: false;
          }
    );

export type RevurderingVedtakInnvilgelseRequest = OppdaterBehandlingRequestBase & {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
};

export type RevurderingVedtakOmgjøringRequest = OppdaterBehandlingRequestBase & {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
} & (
        | {
              skalOmgjøreHeleVedtaket: true;
              omgjøringsperiode: null;
          }
        | {
              skalOmgjøreHeleVedtaket: false;
              omgjøringsperiode: Periode;
          }
    );

export type RevurderingVedtakRequest =
    | RevurderingVedtakStansRequest
    | RevurderingVedtakInnvilgelseRequest
    | RevurderingVedtakOmgjøringRequest;

export type OpprettRevurderingRequest = {
    revurderingType: RevurderingResultat;
    rammevedtakIdSomOmgjøres: Nullable<VedtakId>;
};

export enum HjemmelForStans {
    DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK = 'DeltarIkkePåArbeidsmarkedstiltak',
    ALDER = 'Alder',
    LIVSOPPHOLDYTELSER = 'Livsoppholdytelser',
    KVALIFISERINGSPROGRAMMET = 'Kvalifiseringsprogrammet',
    INTRODUKSJONSPROGRAMMET = 'Introduksjonsprogrammet',
    LØNN_FRA_TILTAKSARRANGØR = 'LønnFraTiltaksarrangør',
    LØNN_FRA_ANDRE = 'LønnFraAndre',
    INSTITUSJONSOPPHOLD = 'Institusjonsopphold',
}
