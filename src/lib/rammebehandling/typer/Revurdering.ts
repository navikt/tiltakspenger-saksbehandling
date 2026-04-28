import { Barnetillegg } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingBaseDTO,
    RammebehandlingBase,
} from './Rammebehandling';
import { Nullable } from '../../../types/UtilTypes';
import { VedtakId } from './Rammevedtak';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

export enum TiltaksdeltakerEndringType {
    AVBRUTT_DELTAKELSE = 'AVBRUTT_DELTAKELSE',
    IKKE_AKTUELL_DELTAKELSE = 'IKKE_AKTUELL_DELTAKELSE',
    FORLENGELSE = 'FORLENGELSE',
    ENDRET_SLUTTDATO = 'ENDRET_SLUTTDATO',
    ENDRET_STARTDATO = 'ENDRET_STARTDATO',
    ENDRET_DELTAKELSESMENGDE = 'ENDRET_DELTAKELSESMENGDE',
    ENDRET_STATUS = 'ENDRET_STATUS',
}

export type TiltaksdeltakerEndring =
    | { type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }
    | { type: TiltaksdeltakerEndringType.IKKE_AKTUELL_DELTAKELSE }
    | { type: TiltaksdeltakerEndringType.FORLENGELSE; nySluttdato: string }
    | { type: TiltaksdeltakerEndringType.ENDRET_SLUTTDATO; nySluttdato: Nullable<string> }
    | { type: TiltaksdeltakerEndringType.ENDRET_STARTDATO; nyStartdato: Nullable<string> }
    | {
          type: TiltaksdeltakerEndringType.ENDRET_DELTAKELSESMENGDE;
          nyDeltakelsesprosent: Nullable<number>;
          nyDagerPerUke: Nullable<number>;
      }
    | { type: TiltaksdeltakerEndringType.ENDRET_STATUS; nyStatus: string };

export type AutomatiskOpprettetGrunn = {
    endringer: TiltaksdeltakerEndring[];
};

type RevurderingBase = RammebehandlingBase & {
    type: Rammebehandlingstype.REVURDERING;
    resultat: RevurderingResultat;
    automatiskOpprettetGrunn: Nullable<AutomatiskOpprettetGrunn>;
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
    skalSendeVedtaksbrev: boolean;
};

export type OmgjøringOpphør = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
    valgteHjemler: HjemmelForOpphør[];
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
    skalSendeVedtaksbrev: boolean;
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
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterOmgjøringInnvilgelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
    vedtaksperiode: Periode;
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterOmgjøringOpphørDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
    valgteHjemler: HjemmelForOpphør[];
    skalSendeVedtaksbrev: boolean;
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
};

export enum HjemmelForStans {
    DeltarIkkePåArbeidsmarkedstiltak = 'DeltarIkkePåArbeidsmarkedstiltak',
    Alder = 'Alder',
    Livsoppholdytelser = 'Livsoppholdytelser',
    Kvalifiseringsprogrammet = 'Kvalifiseringsprogrammet',
    Introduksjonsprogrammet = 'Introduksjonsprogrammet',
    LønnFraTiltaksarrangør = 'LønnFraTiltaksarrangør',
    LønnFraAndre = 'LønnFraAndre',
    Institusjonsopphold = 'Institusjonsopphold',
    IkkeLovligOpphold = 'IkkeLovligOpphold',
}

export enum HjemmelForOpphør {
    DeltarIkkePåArbeidsmarkedstiltak = 'DeltarIkkePåArbeidsmarkedstiltak',
    Alder = 'Alder',
    Livsoppholdytelser = 'Livsoppholdytelser',
    Kvalifiseringsprogrammet = 'Kvalifiseringsprogrammet',
    Introduksjonsprogrammet = 'Introduksjonsprogrammet',
    LønnFraTiltaksarrangør = 'LønnFraTiltaksarrangør',
    LønnFraAndre = 'LønnFraAndre',
    Institusjonsopphold = 'Institusjonsopphold',
    IkkeLovligOpphold = 'IkkeLovligOpphold',
    FremmetForSent = 'FremmetForSent',
}
