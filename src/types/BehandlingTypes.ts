import { AlderVilkår } from './AlderTypes';
import { InstitusjonsoppholdVilkår } from './InstitusjonsoppholdTypes';
import { IntroVilkår } from './IntroduksjonsprogrammetTypes';
import { KravfristVilkår } from './KravfristTypes';
import { KvpVilkår } from './KvpTypes';
import { LivsoppholdVilkår } from './LivsoppholdTypes';
import { Periode } from './Periode';
import { Stønadsdager } from './StønadsdagerTypes';
import { TiltakDeltagelseVilkår } from './TiltakDeltagelseTypes';
import { SakId } from './SakTypes';

export type BehandlingId = `beh_${string}`;
export type SøknadId = `soknad_${string}`;

export type Behandling = {
    id: BehandlingId;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string;
    vurderingsperiode: Periode;
    behandlingstype: TypeBehandling;
    status: BehandlingStatus;
    attesteringer: Attestering[];
    vilkårssett: VilkårsettDTO;
    stønadsdager: Stønadsdager;
};

export type BehandlingForOversikt = {
    id: BehandlingId;
    sakId: SakId;
    typeBehandling: Exclude<TypeBehandling, TypeBehandling.SØKNAD>;
    status: Exclude<BehandlingStatus, BehandlingStatus.SØKNAD>;
    underkjent: boolean;
    kravtidspunkt: string;
    fnr: string;
    periode: Periode;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string | null;
};

export type SøknadForOversikt = {
    id: SøknadId;
    sakId: SakId;
    typeBehandling: TypeBehandling.SØKNAD;
    status: BehandlingStatus.SØKNAD;
    underkjent: boolean;
    kravtidspunkt: string;
    fnr: string;
    periode: null;
    saksnummer: null;
    saksbehandler: null;
    beslutter: null;
};

export type BehandlingEllerSøknadForOversikt = BehandlingForOversikt | SøknadForOversikt;

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

export enum TypeBehandling {
    SØKNAD = 'SØKNAD',
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    REVURDERING = 'REVURDERING',
}
