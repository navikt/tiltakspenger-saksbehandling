import { AntallDagerForMeldeperiode } from './AntallDagerForMeldeperiode';
import { Attestering } from './Attestering';
import { Avbrutt } from './Avbrutt';
import { Barnetillegg } from './Barnetillegg';
import {
    BehandlingResultat,
    Saksopplysninger,
    Behandlingstype,
    OppdaterBehandlingRequest,
    BehandlingId,
    VentestatusHendelse,
    BehandlingUtbetalingProps,
    Behandlingsstatus,
} from './Behandling';

import { Periode } from './Periode';
import { SakId } from './Sak';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from './UtilTypes';
import { VedtakId } from './Vedtak';

export interface Revurdering {
    id: BehandlingId;
    type: Behandlingstype.REVURDERING;
    status: Behandlingsstatus;
    //TODO - kontrakten sier at denne kan være disse + andre behandlingstyper - men så sniker vi inn kun disse 2 verdiene her.
    resultat:
        | BehandlingResultat.REVURDERING_INNVILGELSE
        | BehandlingResultat.STANS
        | BehandlingResultat.OMGJØRING;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    saksopplysninger: Saksopplysninger;
    attesteringer: Attestering[];
    virkningsperiode: Nullable<Periode>;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
    avbrutt: Nullable<Avbrutt>;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: Nullable<VentestatusHendelse>;
    utbetaling: Nullable<BehandlingUtbetalingProps>;
    barnetillegg: Nullable<Barnetillegg>;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerForMeldeperiode[]>;
    valgtHjemmelHarIkkeRettighet: Nullable<HjemmelForStans[]>;
    harValgtStansFraFørsteDagSomGirRett: Nullable<boolean>;
    harValgtStansTilSisteDagSomGirRett: Nullable<boolean>;
    omgjørVedtak: Nullable<string>;
    innvilgelsesperiode: Nullable<Periode>;
    rammevedtakId: Nullable<VedtakId>;
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

export interface RevurderingVedtakOmgjøringRequest extends OppdaterBehandlingRequest {
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
    rammevedtakIdSomOmgjøres: Nullable<string>;
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
