import { Lovreferanse } from './Behandling';
import { NyPeriode, Periode } from './Periode';

export interface KvpVilkår {
  søknadSaksopplysning: KvpSaksopplysning;
  avklartSaksopplysning: KvpSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  vurderingsperiode: NyPeriode;
  samletUtfall: SamletUtfall;
}

interface KvpSaksopplysning {
  periodeMedDeltagelse: PeriodeMedDeltagelse;
  årsakTilEndring?: ÅrsakTilEndring;
  kilde: Kilde;
}

enum Kilde {
  SØKNAD = 'SØKNAD',
  SAKSBEHANDLER = 'SAKSBEHANDLER',
}

enum ÅrsakTilEndring {
  FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
  ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}

export enum SamletUtfall {
  OPPFYLT = 'OPPFYLT',
  DELVIS_OPPFYLT = 'DELVIS_OPPFYLT',
  IKKE_OPPFYLT = 'IKKE_OPPFYLT',
  UAVKLART = 'UAVKLART',
}

interface Saksbehandler {
  navIdent: string;
  brukernavn: string;
  epost: string;
  roller: Rolle[];
}

enum Rolle {
  SAKSBEHANDLER = 'SAKSBEHANDLER',
  FORTROLIG_ADRESSE = 'FORTROLIG_ADRESSE',
  STRENGT_FORTROLIG_ADRESSE = 'STRENGT_FORTROLIG_ADRESSE',
  SKJERMING = 'SKJERMING',
  LAGE_HENDELSER = 'LAGE_HENDELSER',
  DRIFT = 'DRIFT', // Systemadministrator (oss)
  BESLUTTER = 'BESLUTTER',
  ADMINISTRATOR = 'ADMINISTRATOR', // Saksbehandlers administrator (superbruker)
}

interface PeriodeMedDeltagelse {
  periode: NyPeriode;
  deltagelse: Deltagelse;
}

export enum Deltagelse {
  DELTAR = 'DELTAR',
  DELTAR_IKKE = 'DELTAR_IKKE',
}
