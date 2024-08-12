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
  saksbehandler: string;
  beslutter: string;
  vurderingsperiode: Periode;
  status: BehandlingStatus;
  attesteringer: Attestering[];
  vilkårssett: VilkårsettDTO;
  stønadsdager: Stønadsdager;
}

export enum BehandlingStatus {
  SØKNAD = 'SØKNAD',
  KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
  KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
  UNDER_BESLUTNING = 'UNDER_BESLUTNING',
  INNVILGET = 'INNVILGET',
}

interface VilkårsettDTO {
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
  GODKJENT = 'Godkjent',
  SENDT_TILBAKE = 'Sendt tilbake',
}

export interface BehandlingForBenk {
  periode: Periode;
  status: BehandlingStatus;
  // underkjent: Boolean, IKKE IMPLEMENTERT ENDA??
  typeBehandling: TypeBehandling;
  ident: string;
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

export enum SamletUtfall {
  OPPFYLT = 'OPPFYLT',
  DELVIS_OPPFYLT = 'DELVIS_OPPFYLT',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  UAVKLART = 'UAVKLART',
}

export enum TypeBehandling {
  SØKNAD = 'Søknad',
  FØRSTEGANGSBEHANDLING = 'Førstegangsbehandling',
}
