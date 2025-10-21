import { AntallDagerForMeldeperiode } from './AntallDagerForMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    Behandling,
    BehandlingResultat,
    Saksopplysninger,
    Behandlingstype,
    OppdaterBehandlingRequest,
} from './Behandling';

import { Periode } from './Periode';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from './UtilTypes';

export interface Revurdering extends Behandling {
    type: Behandlingstype.REVURDERING;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerForMeldeperiode[]>;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
    omgjørVedtak: Nullable<string>;
    innvilgelsesperiode: Nullable<Periode>;
    saksopplysninger: Saksopplysninger;
    //TODO - kontrakten sier at denne kan være disse + andre behandlingstyper - men så sniker vi inn kun disse 2 verdiene her.
    resultat: BehandlingResultat.REVURDERING_INNVILGELSE | BehandlingResultat.STANS;
}

export interface RevurderingVedtakStansRequest extends OppdaterBehandlingRequest {
    resultat: BehandlingResultat.STANS;
    valgteHjemler: HjemmelForStans[];
    stansFraOgMed: Nullable<string>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    stansTilOgMed: Nullable<string>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
}

export interface RevurderingVedtakInnvilgelseRequest extends OppdaterBehandlingRequest {
    resultat: BehandlingResultat.REVURDERING_INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Barnetillegg;
}

export type RevurderingVedtakRequest =
    | RevurderingVedtakStansRequest
    | RevurderingVedtakInnvilgelseRequest;

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
