import { InstitusjonsoppholdVilkår } from './InstitusjonsoppholdTypes';
import { IntroVilkår } from './IntroduksjonsprogrammetTypes';
import { KvpVilkår } from './KvpTypes';
import { LivsoppholdVilkår } from './LivsoppholdTypes';
import { Periode } from './Periode';
import Tiltaksstatus from './Tiltaksstatus';
import { Utfall } from './Utfall';
import { Vurdering } from './Vurdering';

interface Vilkår {
  lovreferanse: string;
  tittel: string;
}

export interface Saksopplysning {
  fom: string;
  tom: string;
  vilkår: Vilkår;
  kilde: string;
  detaljer: string;
  typeSaksopplysning: string;
}

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
  tiltaksdeltagelsesaksopplysninger: TiltaksdeltagelsesaksopplysningerDTO;
  kravdatoSaksopplysninger: KravdatoSaksopplysninger;
  vilkårsett: VilkårsettDTO;
}

export enum BehandlingTilstand {
  IVERKSATT = 'iverksatt',
  TIL_BESLUTTER = 'tilBeslutter',
  VILKÅRSVURDERT = 'vilkårsvurdert',
  OPPRETTET = 'opprettet',
}

interface KravdatoSaksopplysninger {
  samletUtfall: Utfall;
  opprinneligKravdato: KravdatoSaksopplysning;
  kravdatoFraSaksbehandler: KravdatoSaksopplysning;
  vurderinger: Vurdering[];
  lovreferanse: Lovreferanse;
}

interface VilkårsettDTO {
  kvpVilkår: KvpVilkår;
  introVilkår: IntroVilkår;
  institusjonsoppholdVilkår: InstitusjonsoppholdVilkår;
  livsoppholdVilkår: LivsoppholdVilkår;
}

export interface KravdatoSaksopplysning {
  kravdato: string;
  kilde: string;
}

export interface Endring {
  type: string;
  begrunnelse: string;
  endretAv: string;
  endretTidspunkt: string;
}

export interface BehandlingForBenk {
  id: string;
  ident: string;
  typeBehandling: string;
  fom: string;
  tom: string;
  status: string;
  saksbehandler?: string;
  beslutter?: string;
}

export interface Sak {
  saksnummer: string;
  ident: string;
}

export interface Personopplysninger {
  ident: string;
  fornavn: string;
  etternavn: string;
  skjerming: boolean;
  strengtFortrolig: boolean;
  fortrolig: boolean;
}

export interface TiltaksdeltagelsesaksopplysningerDTO {
  vilkår: string;
  saksopplysninger: RegistrertTiltak[];
  vilkårLovreferanse: Lovreferanse;
}

export interface StønadsdagerSaksopplysning {
  tiltakId: string;
  tiltak: string;
  arrangør: string;
  avklartAntallDager: Stønadsdager[];
  antallDagerSaksopplysningerFraRegister: Stønadsdager;
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
  arrangør: string;
  navn: string;
  periode: Periode;
  status: Tiltaksstatus;
  girRett: boolean;
  harSøkt: boolean;
  kilde: string;
  deltagelseUtfall: Utfall;
  begrunnelse: string;
};
export interface SaksopplysningInnDTO {
  periode: Periode;
  kilde: string;
  detaljer: string;
  saksopplysning: string;
  saksopplysningTittel: string;
  utfall: Utfall;
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
