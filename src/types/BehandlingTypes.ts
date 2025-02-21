import { AlderVilkår } from './AlderTypes';
import { InstitusjonsoppholdVilkår } from './InstitusjonsoppholdTypes';
import { IntroVilkår } from './IntroduksjonsprogrammetTypes';
import { KravfristVilkår } from './KravfristTypes';
import { KvpVilkår } from './KvpTypes';
import { LivsoppholdVilkår } from './LivsoppholdTypes';
import { Periode } from './Periode';
import { Stønadsdager } from './StønadsdagerTypes';
import { TiltakDeltagelseVilkår, Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { SakId } from './SakTypes';
import { SøknadForOversiktProps, SøknadForBehandlingProps } from './SøknadTypes';

export type BehandlingId = `beh_${string}`;

type BehandlingDataCommon = {
    id: BehandlingId;
    type: Behandlingstype;
    status: BehandlingStatus;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: string | null;
    beslutter: string | null;
    attesteringer: Attestering[];
    virkningsperiode: Periode | null;
    saksopplysningsperiode: Periode;
    saksopplysninger: BehandlingSaksopplysningerData;
    begrunnelseVilkårsvurdering: string | null;
};

export type FørstegangsbehandlingData = BehandlingDataCommon & {
    type: Behandlingstype.FØRSTEGANGSBEHANDLING;
    søknad: SøknadForBehandlingProps;
    fritekstTilVedtaksbrev: string | null;
};

export type RevurderingData = BehandlingDataCommon & {
    type: Behandlingstype.REVURDERING;
};

export type BehandlingData = FørstegangsbehandlingData | RevurderingData;

export type BehandlingSaksopplysningerData = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltagelse;
};

export type BehandlingDataDeprecated = {
    id: BehandlingId;
    sakId: SakId;
    saksnummer: string;
    status: BehandlingStatus;
    saksbehandler: string | null;
    beslutter: string | null;
    type: Behandlingstype;
    virkningsperiode: Periode;
    vilkårssett: VilkårsettDTO;
    attesteringer: Attestering[];
    stønadsdager: Stønadsdager;
};

export type BehandlingDataDeprecatedOgNy = BehandlingDataDeprecated | BehandlingData;

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
    erDeprecatedBehandling: boolean | null;
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
}

export type VilkårsettDTO = {
    alderVilkår: AlderVilkår;
    tiltakDeltagelseVilkår: TiltakDeltagelseVilkår;
    kvpVilkår: KvpVilkår;
    introVilkår: IntroVilkår;
    institusjonsoppholdVilkår: InstitusjonsoppholdVilkår;
    livsoppholdVilkår: LivsoppholdVilkår;
    kravfristVilkår: KravfristVilkår;
};

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

export type Personopplysninger = {
    fnr: string;
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    skjerming: boolean;
    strengtFortrolig: boolean;
    fortrolig: boolean;
};

export type Lovreferanse = {
    lovverk: string;
    paragraf: string;
    beskrivelse: string;
};

export enum ÅrsakTilEndring {
    FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
    ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}

export enum Utfall {
    OPPFYLT = 'OPPFYLT',
    DELVIS_OPPFYLT = 'DELVIS_OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    UAVKLART = 'UAVKLART',
}

export enum Behandlingstype {
    SØKNAD = 'SØKNAD',
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
}
