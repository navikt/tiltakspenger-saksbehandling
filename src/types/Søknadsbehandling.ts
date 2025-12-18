import { AntallDagerPerMeldeperiode } from './AntallDagerPerMeldeperiode';
import { Barnetillegg } from './Barnetillegg';
import {
    Rammebehandlingstype,
    OppdaterBehandlingRequestBase,
    RammebehandlingBase,
} from './Rammebehandling';
import { Periode } from './Periode';
import { Søknad } from './Søknad';
import { TiltaksdeltakelsePeriode } from './TiltakDeltagelseTypes';
import { Nullable } from '~/types/UtilTypes';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

interface SøknadsbehandlingBase extends RammebehandlingBase {
    type: Rammebehandlingstype.SØKNADSBEHANDLING;
    resultat: SøknadsbehandlingResultat;
    søknad: Søknad;
    automatiskSaksbehandlet: boolean;
    manueltBehandlesGrunner: ManueltBehandlesGrunn[];
    kanInnvilges: boolean;
}

export interface SøknadsbehandlingIkkeValgt extends SøknadsbehandlingBase {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT;
}

export interface SøknadsbehandlingInnvilgelse extends SøknadsbehandlingBase {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    innvilgelsesperioder: Periode;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[];
    barnetillegg: Nullable<Barnetillegg>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerPerMeldeperiode[]>;
}

export interface SøknadsbehandlingAvslag extends SøknadsbehandlingBase {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
}

export type Søknadsbehandling =
    | SøknadsbehandlingInnvilgelse
    | SøknadsbehandlingAvslag
    | SøknadsbehandlingIkkeValgt;

export enum SøknadsbehandlingResultat {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    IKKE_VALGT = 'IKKE_VALGT',
}

export interface SøknadsbehandlingVedtakInnvilgelseRequest extends OppdaterBehandlingRequestBase {
    resultat: SøknadsbehandlingResultat.INNVILGELSE;
    innvilgelsesperioder: Innvilgelsesperiode[];
    barnetillegg: Barnetillegg;
}

export interface SøknadsbehandlingVedtakAvslagRequest extends OppdaterBehandlingRequestBase {
    resultat: SøknadsbehandlingResultat.AVSLAG;
    avslagsgrunner: Avslagsgrunn[];
}

export interface SøknadsbehandlingVedtakIkkeValgtRequest extends OppdaterBehandlingRequestBase {
    resultat: SøknadsbehandlingResultat.IKKE_VALGT;
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
    SAKSOPPLYSNING_TILTAK_MANGLER_DELTAKELSESMENGDE = 'SAKSOPPLYSNING_TILTAK_MANGLER_DELTAKELSESMENGDE',
    SAKSOPPLYSNING_TILTAK_MER_ENN_FEM_DAGER_PER_UKE = 'SAKSOPPLYSNING_TILTAK_MER_ENN_FEM_DAGER_PER_UKE',
    SAKSOPPLYSNING_DELTIDSTILTAK_UTEN_DAGER_PER_UKE = 'SAKSOPPLYSNING_DELTIDSTILTAK_UTEN_DAGER_PER_UKE',
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
