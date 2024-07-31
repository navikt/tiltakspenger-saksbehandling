import { AlderVilkår } from './AlderTypes';
import { InstitusjonsoppholdVilkår } from './InstitusjonsoppholdTypes';
import { IntroVilkår } from './IntroduksjonsprogrammetTypes';
import { KravfristVilkår } from './KravfristTypes';
import { KvpVilkår } from './KvpTypes';
import { LivsoppholdVilkår } from './LivsoppholdTypes';
import { Periode } from './Periode';
import { TiltakDeltagelseVilkår } from './TiltakDeltagelseTypes';
import Tiltaksstatus from './Tiltaksstatus';
import { Utfall } from './Utfall';

export interface Behandling {
  behandlingId: string;
  saksbehandler: string;
  beslutter: string;
  vurderingsperiode: Periode;
  personopplysninger: Personopplysninger;
  behandlingTilstand: string;
  status: string;
  endringslogg: Endring[];
  samletUtfall: Utfall;
  stønadsdager: StønadsdagerSaksopplysning[];
  tiltaksdeltagelsesaksopplysning: TiltaksdeltagelsesaksopplysningDTO;
  vilkårsett: VilkårsettDTO;
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

export interface Endring {
  type: string;
  begrunnelse: string;
  endretAv: string;
  endretTidspunkt: string;
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
  ident: string;
  fornavn: string;
  etternavn: string;
  skjerming: boolean;
  strengtFortrolig: boolean;
  fortrolig: boolean;
}

export interface TiltaksdeltagelsesaksopplysningDTO {
  vilkår: string;
  saksopplysninger: RegistrertTiltak;
  vilkårLovreferanse: Lovreferanse;
}

export interface StønadsdagerSaksopplysning {
  tiltakId: string;
  tiltak: string;
  antallDagerSaksopplysningFraRegister: Stønadsdager;
}

export interface Stønadsdager {
  periode: Periode;
  antallDager: number;
  kilde: string;
}

export interface Lovreferanse {
  lovverk: string;
  paragraf: string;
  beskrivelse: string;
}

export type RegistrertTiltak = {
  id: string;
  navn: string;
  periode: Periode;
  status: Tiltaksstatus;
  girRett: boolean;
  kilde: string;
  deltagelseUtfall: Utfall;
};

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
