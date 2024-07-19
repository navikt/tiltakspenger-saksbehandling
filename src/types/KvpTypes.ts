import { Lovreferanse, ÅrsakTilEndring, SamletUtfall } from './BehandlingTypes';
import { NyPeriode } from './Periode';

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

export interface PeriodeMedDeltagelse {
  periode: NyPeriode;
  deltagelse: Deltagelse;
}

export enum Deltagelse {
  DELTAR = 'DELTAR',
  DELTAR_IKKE = 'DELTAR_IKKE',
}
