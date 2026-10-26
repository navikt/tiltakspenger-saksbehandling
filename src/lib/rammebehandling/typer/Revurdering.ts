import { Barnetillegg, BarnetilleggDTO } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingBaseDTO,
    RammebehandlingBase,
} from './Rammebehandling';
import { Nullable } from '~/types/UtilTypes';
import { Omgjøringsgrad, VedtakId } from './Rammevedtak';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

export enum TiltaksdeltakerEndringType {
    AVBRUTT_DELTAKELSE = 'AVBRUTT_DELTAKELSE',
    IKKE_AKTUELL_DELTAKELSE = 'IKKE_AKTUELL_DELTAKELSE',
    FORLENGELSE = 'FORLENGELSE',
    AVKORTET = 'AVKORTET',
    ENDRET_SLUTTDATO = 'ENDRET_SLUTTDATO',
    ENDRET_STARTDATO = 'ENDRET_STARTDATO',
    ENDRET_DELTAKELSESMENGDE = 'ENDRET_DELTAKELSESMENGDE',
    ENDRET_STATUS = 'ENDRET_STATUS',
}

export type TiltaksdeltakerEndring =
    | { type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }
    | { type: TiltaksdeltakerEndringType.IKKE_AKTUELL_DELTAKELSE }
    | { type: TiltaksdeltakerEndringType.FORLENGELSE; nySluttdato: string }
    | { type: TiltaksdeltakerEndringType.AVKORTET; nySluttdato: string }
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

// Forlenger et innvilget vedtak fra dagen etter det slutter. Saksbehandler velger bare til og med-datoen.
// Innvilgelsesperiodene og barnetillegget er null til til og med-datoen er valgt.
export type RevurderingForlengelse = RevurderingBase & {
    resultat: RevurderingResultat.FORLENGELSE;
    forlengerRammevedtakId: VedtakId;
    forlengesFraOgMed: string;
    // Om saksbehandler har valgt barnetillegget selv. Ellers er det utledet fra vedtaket som forlenges.
    harEndretBarnetillegg: boolean;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
};

export type OmgjøringInnvilgelse = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING;
    vedtaksperiode: Periode;
    innvilgelsesperioder: Nullable<Innvilgelsesperiode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    omgjørRammevedtak: OmgjørRammevedtak[];
    skalSendeVedtaksbrev: boolean;
};

export type OmgjøringOpphør = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING_OPPHØR;
    vedtaksperiode: Periode;
    valgteHjemler: HjemmelForOpphør[];
    omgjørRammevedtak: OmgjørRammevedtak[];
};

export type OmgjøringIkkeValgt = RevurderingBase & {
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT;
    omgjørRammevedtak: OmgjørRammevedtak[];
};

// Vedtakene (og periodene av dem) som omgjøres av behandlingen, sortert på periode.
// Samme vedtak kan forekomme flere ganger dersom det omgjøres over flere perioder.
export type OmgjørRammevedtak = {
    vedtakId: VedtakId;
    periode: Periode;
    omgjøringsgrad: Omgjøringsgrad;
};

export type Omgjøring = OmgjøringInnvilgelse | OmgjøringOpphør | OmgjøringIkkeValgt;

export type Revurdering =
    RevurderingStans | RevurderingInnvilgelse | RevurderingForlengelse | Omgjøring;

export enum RevurderingResultat {
    STANS = 'STANS',
    INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING = 'OMGJØRING',
    OMGJØRING_OPPHØR = 'OMGJØRING_OPPHØR',
    OMGJØRING_IKKE_VALGT = 'OMGJØRING_IKKE_VALGT',
    FORLENGELSE = 'FORLENGELSE',
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
    barnetillegg: BarnetilleggDTO;
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterRevurderingForlengelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.FORLENGELSE;
    tilOgMed: string;
    // Null betyr at barnetillegget utledes fra vedtaket som forlenges.
    barnetillegg: Nullable<BarnetilleggDTO>;
    skalSendeVedtaksbrev: boolean;
};

export type OppdaterOmgjøringInnvilgelseDTO = OppdaterBehandlingBaseDTO & {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: BarnetilleggDTO;
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
    OppdaterOmgjøringInnvilgelseDTO | OppdaterOmgjøringOpphørDTO | OppdaterOmgjøringIkkeValgtDTO;

export type OppdaterRevurderingDTO =
    | OppdaterRevurderingStansDTO
    | OppdaterRevurderingInnvilgelseDTO
    | OppdaterRevurderingForlengelseDTO
    | OppdaterOmgjøringDTO;

export type StartRevurderingDTO = {
    revurderingType: RevurderingResultat;
    rammevedtakIdSomOmgjøres?: Nullable<VedtakId>;
    rammevedtakIdSomForlenges?: Nullable<VedtakId>;
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
