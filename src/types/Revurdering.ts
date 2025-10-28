import { AntallDagerForMeldeperiode } from './AntallDagerForMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    BehandlingResultat,
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
    resultat: RevurderingResultat;
}

export interface RevurderingStans extends RevurderingBase {
    resultat: BehandlingResultat.STANS;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingInnvilgelse extends RevurderingBase {
    resultat: BehandlingResultat.REVURDERING_INNVILGELSE;
}

export interface RevurderingOmgjøring extends RevurderingBase {
    resultat: BehandlingResultat.OMGJØRING;
    omgjørVedtak: VedtakId;
}

export type Revurdering = RevurderingStans | RevurderingInnvilgelse | RevurderingOmgjøring;

export type RevurderingResultat =
    | BehandlingResultat.REVURDERING_INNVILGELSE
    | BehandlingResultat.STANS
    | BehandlingResultat.OMGJØRING;

export interface RevurderingVedtakStansRequest extends OppdaterBehandlingRequestBase {
    resultat: BehandlingResultat.STANS;
    valgteHjemler: HjemmelForStans[];
    stansFraOgMed: Nullable<string>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    stansTilOgMed: Nullable<string>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingVedtakInnvilgelseRequest extends OppdaterBehandlingRequestBase {
    resultat: BehandlingResultat.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Barnetillegg;
}

export interface RevurderingVedtakOmgjøringRequest extends OppdaterBehandlingRequestBase {
    resultat: BehandlingResultat.OMGJØRING;
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
    revurderingType: BehandlingResultat;
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
