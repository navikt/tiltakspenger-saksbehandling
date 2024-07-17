import { Lovreferanse, ÅrsakTilEndring, SamletUtfall } from './Behandling';
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


interface PeriodeMedDeltagelse {
  periode: NyPeriode;
  deltagelse: Deltagelse;
}

export interface DeltakelseMedPeriode {
  periode: NyPeriode;
  deltakelse: boolean;
}

export enum Deltagelse {
  DELTAR = 'DELTAR',
  DELTAR_IKKE = 'DELTAR_IKKE',
}
