import { AlderVilkår } from './AlderTypes';
import { InstitusjonsoppholdVilkår } from './InstitusjonsoppholdTypes';
import { IntroVilkår } from './IntroduksjonsprogrammetTypes';
import { KravfristVilkår } from './KravfristTypes';
import { KvpVilkår } from './KvpTypes';
import { LivsoppholdVilkår } from './LivsoppholdTypes';
import { Periode } from './Periode';
import { Stønadsdager } from './StønadsdagerTypes';
import { TiltakDeltagelseVilkår } from './TiltakDeltagelseTypes';

export interface Behandling {
    id: string;
    sakId: string;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string;
    vurderingsperiode: Periode;
    behandlingstype: TypeBehandling;
    status: BehandlingStatus;
    attesteringer: Attestering[];
    vilkårssett: VilkårsettDTO;
    stønadsdager: Stønadsdager;
    tilleggstekstBrev?: TilleggstekstBrev;
    kreverBegrunnelse: boolean;
}

export enum BehandlingStatus {
    SØKNAD = 'SØKNAD',
    KAN_BEHANDLES = 'KAN_BEHANDLES',
    KAN_IKKE_BEHANDLES = 'KAN_IKKE_BEHANDLES',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    VEDTATT = 'VEDTATT',
}

export enum Subsumsjon {
    TILTAKSDELTAGELSE = 'TILTAKSDELTAGELSE',
}

export const subsumsjoner = Object.values(Subsumsjon);

export interface TilleggstekstBrev {
    subsumsjon: Subsumsjon;
    tekst: string;
}

export interface VilkårsettDTO {
    alderVilkår: AlderVilkår;
    tiltakDeltagelseVilkår: TiltakDeltagelseVilkår;
    kvpVilkår: KvpVilkår;
    introVilkår: IntroVilkår;
    institusjonsoppholdVilkår: InstitusjonsoppholdVilkår;
    livsoppholdVilkår: LivsoppholdVilkår;
    kravfristVilkår: KravfristVilkår;
}

export interface Attestering {
    status: Attesteringsstatus;
    begrunnelse: string;
    endretAv: string;
    endretTidspunkt: string;
}

export enum Attesteringsstatus {
    GODKJENT = 'GODKJENT',
    SENDT_TILBAKE = 'SENDT_TILBAKE',
}

export interface BehandlingForBenk {
    periode: Periode;
    status: BehandlingStatus;
    underkjent: boolean;
    kravtidspunkt: string;
    typeBehandling: TypeBehandling;
    fnr: string;
    saksnummer: string;
    id: string;
    saksbehandler: string;
    beslutter: string;
    sakId: string;
}

export interface Personopplysninger {
    fnr: string;
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    skjerming: boolean;
    strengtFortrolig: boolean;
    fortrolig: boolean;
}

export interface Lovreferanse {
    lovverk: string;
    paragraf: string;
    beskrivelse: string;
}

export enum ÅrsakTilEndring {
    FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
    ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}

export const årsaker = Object.values(ÅrsakTilEndring);

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
