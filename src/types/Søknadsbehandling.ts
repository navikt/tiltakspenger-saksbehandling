import { AntallDagerForMeldeperiode } from './AntallDagerForMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    Behandling,
    BehandlingResultat,
    Behandlingstype,
    OppdaterBehandlingRequest,
} from './Behandling';

import { Periode } from './Periode';
import { SøknadDTO } from './Søknad';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from './UtilTypes';

export interface Søknadsbehandling extends Behandling {
    type: Behandlingstype.SØKNADSBEHANDLING;
    søknad: SøknadDTO;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerForMeldeperiode[]>;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
    automatiskSaksbehandlet: boolean;
    manueltBehandlesGrunner: ManueltBehandlesGrunn[];
    //TODO - kontrakten sier at denne kan være null + andre behandlingstyper - men så sniker vi inn kun disse 2 verdiene her.
    resultat: Nullable<BehandlingResultat.AVSLAG | BehandlingResultat.INNVILGELSE>;
}

export interface SøknadsbehandlingVedtakInnvilgelseRequest extends OppdaterBehandlingRequest {
    resultat: BehandlingResultat.INNVILGELSE;
    innvilgelsesperiode: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    antallDagerPerMeldeperiodeForPerioder: AntallDagerForMeldeperiode[];
    barnetillegg: Barnetillegg;
}

export interface SøknadsbehandlingVedtakAvslagRequest extends OppdaterBehandlingRequest {
    resultat: BehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
}

export interface SøknadsbehandlingVedtakIkkeValgtRequest extends OppdaterBehandlingRequest {
    resultat: BehandlingResultat.IKKE_VALGT;
}

export type SøknadsbehandlingVedtakRequest =
    | SøknadsbehandlingVedtakInnvilgelseRequest
    | SøknadsbehandlingVedtakAvslagRequest
    | SøknadsbehandlingVedtakIkkeValgtRequest;

/**
 * https://confluence.adeo.no/pages/viewpage.action?pageId=679150248
 */
export enum Avslagsgrunn {
    DeltarIkkePåArbeidsmarkedstiltak = 'DeltarIkkePåArbeidsmarkedstiltak',
    Alder = 'Alder',
    Livsoppholdytelser = 'Livsoppholdytelser',
    Kvalifiseringsprogrammet = 'Kvalifiseringsprogrammet',
    Introduksjonsprogrammet = 'Introduksjonsprogrammet',
    LønnFraTiltaksarrangør = 'LønnFraTiltaksarrangør',
    LønnFraAndre = 'LønnFraAndre',
    Institusjonsopphold = 'Institusjonsopphold',
    FremmetForSent = 'FremmetForSent',
}

export enum ManueltBehandlesGrunn {
    SOKNAD_HAR_ANDRE_YTELSER = 'SOKNAD_HAR_ANDRE_YTELSER',
    SOKNAD_HAR_LAGT_TIL_BARN_MANUELT = 'SOKNAD_HAR_LAGT_TIL_BARN_MANUELT',
    SOKNAD_BARN_UTENFOR_EOS = 'SOKNAD_BARN_UTENFOR_EOS',
    SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN = 'SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN',
    SOKNAD_BARN_FODT_I_SOKNADSPERIODEN = 'SOKNAD_BARN_FODT_I_SOKNADSPERIODEN',
    SOKNAD_HAR_KVP = 'SOKNAD_HAR_KVP',
    SOKNAD_INTRO = 'SOKNAD_INTRO',
    SOKNAD_INSTITUSJONSOPPHOLD = 'SOKNAD_INSTITUSJONSOPPHOLD',

    SAKSOPPLYSNING_FANT_IKKE_TILTAK = 'SAKSOPPLYSNING_FANT_IKKE_TILTAK',
    SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE = 'SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE',
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK = 'SAKSOPPLYSNING_OVERLAPPENDE_TILTAK',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD = 'SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE = 'SAKSOPPLYSNING_ULIK_TILTAKSPERIODE',
    SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK = 'SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK',
    SAKSOPPLYSNING_ANDRE_YTELSER = 'SAKSOPPLYSNING_ANDRE_YTELSER',
    SAKSOPPLYSNING_VEDTAK_I_ARENA = 'SAKSOPPLYSNING_VEDTAK_I_ARENA',

    ANNET_APEN_BEHANDLING = 'ANNET_APEN_BEHANDLING',
    ANNET_VEDTAK_FOR_SAMME_PERIODE = 'ANNET_VEDTAK_FOR_SAMME_PERIODE',
    ANNET_HAR_SOKT_FOR_SENT = 'ANNET_HAR_SOKT_FOR_SENT',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN = 'ANNET_ER_UNDER_18_I_SOKNADSPERIODEN',
}
