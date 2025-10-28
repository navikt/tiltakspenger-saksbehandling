import { AntallDagerForMeldeperiode } from './AntallDagerForMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    RammebehandlingResultatType,
    Behandlingstype,
    OppdaterBehandlingRequestBase,
    RammebehandlingBase,
} from './Behandling';
import { Periode } from './Periode';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from './UtilTypes';
import { VedtakId } from './Vedtak';

interface RevurderingBase extends RammebehandlingBase {
    type: Behandlingstype.REVURDERING;
    resultat: RevurderingResultatType;
}

export type Revurdering = RevurderingStans | RevurderingInnvilgelse | RevurderingOmgjøring;

export interface RevurderingStans extends RevurderingBase {
    resultat: RammebehandlingResultatType.STANS;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingInnvilgelse extends RevurderingBase {
    resultat: RammebehandlingResultatType.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Nullable<Periode>;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerForMeldeperiode[]>;
}

export interface RevurderingOmgjøring extends RevurderingBase {
    resultat: RammebehandlingResultatType.OMGJØRING;
    omgjørVedtak: VedtakId;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    barnetillegg: Barnetillegg;
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiode[];
}

export type RevurderingResultatType =
    | RammebehandlingResultatType.REVURDERING_INNVILGELSE
    | RammebehandlingResultatType.STANS
    | RammebehandlingResultatType.OMGJØRING;

export interface RevurderingVedtakStansRequest extends OppdaterBehandlingRequestBase {
    resultat: RammebehandlingResultatType.STANS;
    valgteHjemler: HjemmelForStans[];
    stansFraOgMed: Nullable<string>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    stansTilOgMed: Nullable<string>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingVedtakInnvilgelseRequest extends OppdaterBehandlingRequestBase {
    resultat: RammebehandlingResultatType.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Barnetillegg;
}

export interface RevurderingVedtakOmgjøringRequest extends OppdaterBehandlingRequestBase {
    resultat: RammebehandlingResultatType.OMGJØRING;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Barnetillegg;
}

export type RevurderingVedtakRequest =
    | RevurderingVedtakStansRequest
    | RevurderingVedtakInnvilgelseRequest
    | RevurderingVedtakOmgjøringRequest;

export type OpprettRevurderingRequest = {
    revurderingType: RammebehandlingResultatType;
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
