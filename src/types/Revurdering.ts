import { AntallDagerPerMeldeperiode } from './AntallDagerPerMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingRequestBase,
    RammebehandlingBase,
} from './Rammebehandling';
import { Periode } from './Periode';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from './UtilTypes';
import { VedtakId } from './Rammevedtak';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

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
    innvilgelsesperiode: Nullable<Periode>;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerPerMeldeperiode[]>;
}

export interface RevurderingOmgjøring extends RevurderingBase {
    resultat: RevurderingResultat.OMGJØRING;
    omgjørVedtak: VedtakId;
    innvilgelsesperiode: Nullable<Periode>;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    barnetillegg: Nullable<Barnetillegg>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerPerMeldeperiode[]>;
}

export enum RevurderingResultat {
    STANS = 'STANS',
    INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING = 'OMGJØRING',
}

export interface RevurderingVedtakStansRequest extends OppdaterBehandlingRequestBase {
    resultat: RevurderingResultat.STANS;
    valgteHjemler: HjemmelForStans[];
    stansFraOgMed: Nullable<string>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    stansTilOgMed: Nullable<string>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingVedtakInnvilgelseRequest extends OppdaterBehandlingRequestBase {
    resultat: RevurderingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
}

export interface RevurderingVedtakOmgjøringRequest extends OppdaterBehandlingRequestBase {
    resultat: RevurderingResultat.OMGJØRING;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
}

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
