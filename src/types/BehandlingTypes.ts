import { Periode } from './Periode';
import { Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { SakId } from './SakTypes';
import { SøknadForOversiktProps, SøknadForBehandlingProps } from './SøknadTypes';
import { Avbrutt } from './Avbrutt';
import { Nullable } from '~/types/UtilTypes';
import { Ytelse } from '~/types/Ytelse';

export type BehandlingId = `beh_${string}`;

type BehandlingDataCommon = {
    id: BehandlingId;
    status: BehandlingStatus;
    resultat: Nullable<BehandlingResultat>;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    attesteringer: Attestering[];
    virkningsperiode: Nullable<Periode>;
    saksopplysninger: BehandlingSaksopplysningerData;
    begrunnelseVilkårsvurdering: Nullable<string>;
    avbrutt: Nullable<Avbrutt>;
    iverksattTidspunkt: Nullable<string>;
    fritekstTilVedtaksbrev: string | null;
};

export interface AntallDagerForMeldeperiode {
    antallDagerPerMeldeperiode: number;
    periode: Periode;
}

type InnvilgelseResultatData = {
    barnetillegg: Nullable<BarnetilleggData>;
    valgteTiltaksdeltakelser: Nullable<TiltaksdeltakelsePeriode[]>;
    antallDagerPerMeldeperiode: Nullable<AntallDagerForMeldeperiode[]>;
};

type StansResultatData = {
    valgtHjemmelHarIkkeRettighet: Nullable<string[]>;
};

type AvslagResultatData = {
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

export type SøknadsbehandlingData = BehandlingDataCommon & {
    type: Behandlingstype.SØKNADSBEHANDLING;
    resultat: Nullable<SøknadsbehandlingResultat>;
    søknad: SøknadForBehandlingProps;
    automatiskSaksbehandlet: boolean;
    manueltBehandlesGrunner: ManueltBehandlesGrunn[];
} & InnvilgelseResultatData &
    AvslagResultatData;

export type RevurderingData = BehandlingDataCommon & {
    type: Behandlingstype.REVURDERING;
    resultat: RevurderingResultat;
} & InnvilgelseResultatData &
    StansResultatData;

export type BehandlingData = SøknadsbehandlingData | RevurderingData;

export type BehandlingSaksopplysningerData = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltagelse[];
    saksopplysningsperiode: Periode;
    ytelser: Ytelse[];
};

export type BehandlingForOversiktData = {
    id: BehandlingId;
    sakId: SakId;
    status: Exclude<BehandlingStatus, BehandlingStatus.SØKNAD>;
    underkjent: boolean;
    kravtidspunkt: string | null;
    fnr: string;
    periode: Periode;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string | null;
    opprettet: string;
} & (
    | {
          typeBehandling: Behandlingstype.REVURDERING;
          resultat: RevurderingResultat;
      }
    | {
          typeBehandling: Behandlingstype.SØKNADSBEHANDLING;
          resultat: Nullable<SøknadsbehandlingResultat>;
      }
);

export type BehandlingEllerSøknadForOversiktData =
    | BehandlingForOversiktData
    | SøknadForOversiktProps;

export enum BehandlingStatus {
    SØKNAD = 'SØKNAD',
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    VEDTATT = 'VEDTATT',
    AVBRUTT = 'AVBRUTT',
}

export type Attestering = {
    status: Attesteringsstatus;
    begrunnelse: string;
    endretAv: string;
    endretTidspunkt: string;
};

export enum Attesteringsstatus {
    GODKJENT = 'GODKJENT',
    SENDT_TILBAKE = 'SENDT_TILBAKE',
}

export enum Behandlingstype {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
}

export type BarnetilleggData = {
    perioder: BarnetilleggPeriode[];
    begrunnelse?: string;
};

type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

type TiltaksdeltakelsePeriode = {
    eksternDeltagelseId: string;
    periode: Periode;
};

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
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK = 'SAKSOPPLYSNING_OVERLAPPENDE_TILTAK',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD = 'SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE = 'SAKSOPPLYSNING_ULIK_TILTAKSPERIODE',
    SAKSOPPLYSNING_ANDRE_YTELSER = 'SAKSOPPLYSNING_ANDRE_YTELSER',

    ANNET_APEN_BEHANDLING = 'ANNET_APEN_BEHANDLING',
    ANNET_VEDTAK_FOR_SAMME_PERIODE = 'ANNET_VEDTAK_FOR_SAMME_PERIODE',
    ANNET_HAR_SOKT_FOR_SENT = 'ANNET_HAR_SOKT_FOR_SENT',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN = 'ANNET_ER_UNDER_18_I_SOKNADSPERIODEN',
}

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

export enum SøknadsbehandlingResultat {
    AVSLAG = 'AVSLAG',
    INNVILGELSE = 'INNVILGELSE',
}

export enum RevurderingResultat {
    STANS = 'STANS',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
}

export type BehandlingResultat = SøknadsbehandlingResultat | RevurderingResultat;
