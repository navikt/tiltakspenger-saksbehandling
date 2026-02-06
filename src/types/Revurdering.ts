import { Barnetillegg } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingBaseDTO,
    RammebehandlingBase,
} from './Rammebehandling';
import { Nullable } from './UtilTypes';
import { VedtakId } from './Rammevedtak';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

type RevurderingBase = RammebehandlingBase & {
    type: Rammebehandlingstype.REVURDERING;
    resultat: RevurderingResultat;
};

export type RevurderingStans = RevurderingBase & {
    resultat: RevurderingResultat.STANS;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
};

export type RevurderingInnvilgelse = RevurderingBase & {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
};

export type OmgjøringInnvilgelse = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING;
    vedtaksperiode: Periode;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    omgjørVedtak: VedtakId;
};

export type OmgjøringOpphør = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
    omgjørVedtak: VedtakId;
};

export type OmgjøringIkkeValgt = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT;
    omgjørVedtak: VedtakId;
};

export type Omgjøring = OmgjøringInnvilgelse | OmgjøringOpphør | OmgjøringIkkeValgt;

export type Revurdering = RevurderingStans | RevurderingInnvilgelse | Omgjøring;

export enum RevurderingResultat {
    STANS = 'STANS',
    INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING = 'OMGJØRING',
    OMGJØRING_OPPHØR = 'OMGJØRING_OPPHØR',
    OMGJØRING_IKKE_VALGT = 'OMGJØRING_IKKE_VALGT',
}

export type OmgjøringResultat =
    | RevurderingResultat.OMGJØRING
    | RevurderingResultat.OMGJØRING_OPPHØR
    | RevurderingResultat.OMGJØRING_IKKE_VALGT;

export type OppdaterRevurderingStansDTO = OppdaterBehandlingBaseDTO & {
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

export type OppdaterRevurderingInnvilgelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
};

export type OppdaterOmgjøringInnvilgelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
    vedtaksperiode: Periode;
};

export type OppdaterOmgjøringOpphørDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
};

export type OppdaterOmgjøringIkkeValgtDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT;
    fritekstTilVedtaksbrev: null;
    begrunnelseVilkårsvurdering: null;
};

export type OppdaterOmgjøringDTO =
    | OppdaterOmgjøringInnvilgelseDTO
    | OppdaterOmgjøringOpphørDTO
    | OppdaterOmgjøringIkkeValgtDTO;

export type OppdaterRevurderingDTO =
    | OppdaterRevurderingStansDTO
    | OppdaterRevurderingInnvilgelseDTO
    | OppdaterOmgjøringDTO;

export type StartRevurderingDTO = {
    revurderingType: RevurderingResultat;
    rammevedtakIdSomOmgjøres: Nullable<VedtakId>;
    // TODO: kan fjernes når gammel funksjonalitet for omgjøring er fjernet i backend
    nyOmgjøring?: boolean;
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
