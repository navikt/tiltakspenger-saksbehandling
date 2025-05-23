import { Periode } from './Periode';
import { Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { SakId } from './SakTypes';
import { SøknadForOversiktProps, SøknadForBehandlingProps } from './SøknadTypes';
import { Avbrutt } from './Avbrutt';
import { Nullable } from './common';

export type BehandlingId = `beh_${string}`;

type BehandlingDataCommon = {
    id: BehandlingId;
    status: BehandlingStatus;
    utfall: Nullable<Behandlingsutfall>;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: string | null;
    beslutter: string | null;
    attesteringer: Attestering[];
    virkningsperiode: Periode | null;
    saksopplysningsperiode: Periode;
    saksopplysninger: BehandlingSaksopplysningerData;
    begrunnelseVilkårsvurdering: string | null;
    avbrutt: Nullable<Avbrutt>;
    iverksattTidspunkt: Nullable<string>;
    fritekstTilVedtaksbrev: string | null;
    valgtHjemmelHarIkkeRettighet: string[] | null;
    avslagsgrunner: Nullable<Avslagsgrunn[]>;
};

export type FørstegangsbehandlingData = BehandlingDataCommon & {
    type: Behandlingstype.FØRSTEGANGSBEHANDLING;
    søknad: SøknadForBehandlingProps;
    barnetillegg: Barnetillegg | null;
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriode[] | null;
    antallDagerPerMeldeperiode: number | null;
};

export type RevurderingData = BehandlingDataCommon & {
    type: Behandlingstype.REVURDERING;
};

export type BehandlingData = FørstegangsbehandlingData | RevurderingData;

export type BehandlingSaksopplysningerData = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltagelse[];
};

// TODO: revurdering og førstegangsbehandling bør ha separate typer
export type BehandlingForOversiktData = {
    id: BehandlingId;
    sakId: SakId;
    typeBehandling: Exclude<Behandlingstype, Behandlingstype.SØKNAD>;
    status: Exclude<BehandlingStatus, BehandlingStatus.SØKNAD>;
    underkjent: boolean;
    kravtidspunkt: string | null;
    fnr: string;
    periode: Periode;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string | null;
    opprettet: string;
};

export type BehandlingEllerSøknadForOversiktData =
    | BehandlingForOversiktData
    | SøknadForOversiktProps;

export enum BehandlingStatus {
    SØKNAD = 'SØKNAD',
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
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
}

type Barnetillegg = {
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

export enum Behandlingsutfall {
    AVSLAG = 'AVSLAG',
    INNVILGELSE = 'INNVILGELSE',
    STANS = 'STANS',
}

export enum RevurderingType {
    STANS = 'STANS',
    INNVILGELSE = 'INNVILGELSE',
}
