import { Lovreferanse, Utfall, ÅrsakTilEndring } from './BehandlingTypes';
import { Periode } from './Periode';

export interface TiltakDeltagelseVilkår {
  registerSaksopplysning: TiltakDeltagelseSaksopplysning;
  saksbehandlerSaksopplysning: TiltakDeltagelseSaksopplysning;
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

export enum DeltagelseStatus {
  HarSluttet = 'HarSluttet',
}

export const deltagelsestatuser = Object.values(DeltagelseStatus);

interface StatusForPeriode {
  periode: Periode;
  status: DeltagelseStatus;
}

export interface tiltaksdeltagelseBody {
  statusForPeriode: StatusForPeriode[];
  årsakTilEndring: ÅrsakTilEndring;
}
