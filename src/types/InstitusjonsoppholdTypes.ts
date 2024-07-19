import { Lovreferanse, ÅrsakTilEndring, SamletUtfall } from './Behandling';
import { NyPeriode } from './Periode';

export interface InstitusjonsoppholdVilkår {
  søknadSaksopplysning: InstitusjonsoppholdSaksopplysning;
  avklartSaksopplysning: InstitusjonsoppholdSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  vurderingsperiode: NyPeriode;
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
  periode: NyPeriode;
  opphold: Opphold;
}

export interface OppholdMedPeriode {
  periode: NyPeriode;
  opphold: boolean;
}

export enum Opphold {
  OPPHOLD = 'OPPHOLD',
  IKKE_OPPHOLD = 'IKKE_OPPHOLD',
}
