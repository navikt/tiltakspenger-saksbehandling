import { Lovreferanse, Utfall } from './BehandlingTypes';
import { Periode } from './Periode';

export interface TiltakDeltagelseVilkår {
  registerSaksopplysning: TiltakDeltagelseSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  utfallperiode: Periode;
  samletUtfall: Utfall;
}

interface TiltakDeltagelseSaksopplysning {
  tiltakNavn: string;
  deltagelsePeriode: Periode;
  status: string;
  kilde: Kilde;
}

enum Kilde {
  KOMET = 'Komet',
  ARENA = 'Arena',
}
