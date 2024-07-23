import { Lovreferanse, ÅrsakTilEndring, SamletUtfall } from './BehandlingTypes';
import { Periode } from './Periode';

export interface InstitusjonsoppholdVilkår {
  søknadSaksopplysning: InstitusjonsoppholdSaksopplysning;
  avklartSaksopplysning: InstitusjonsoppholdSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  vurderingsperiode: Periode;
  samletUtfall: SamletUtfall;
}

interface InstitusjonsoppholdSaksopplysning {
  periodeMedOpphold: PeriodeMedOpphold;
  årsakTilEndring?: ÅrsakTilEndring;
  kilde: Kilde;
}

enum Kilde {
  SØKNAD = 'SØKNAD',
  SAKSBEHANDLER = 'SAKSBEHANDLER',
}

interface PeriodeMedOpphold {
  periode: Periode;
  opphold: Opphold;
}

export interface OppholdMedPeriode {
  periode: Periode;
  opphold: boolean;
}

export enum Opphold {
  OPPHOLD = 'OPPHOLD',
  IKKE_OPPHOLD = 'IKKE_OPPHOLD',
}
