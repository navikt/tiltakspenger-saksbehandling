import { Lovreferanse } from './BehandlingTypes';
import { Periode } from './Periode';

export interface Stønadsdager {
  registerSaksopplysning: StønadsdagerSaksopplysning;
  lovreferanse: Lovreferanse;
}

interface StønadsdagerSaksopplysning {
  tiltakNavn: string;
  antallDager: number;
  periode: Periode;
  kilde: Kilde;
}

enum Kilde {
  KOMET = 'Komet',
  ARENA = 'Arena',
}
