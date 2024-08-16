import { Lovreferanse, Utfall } from './BehandlingTypes';
import { Periode } from './Periode';
import { Saksbehandler } from './Saksbehandler';

export interface LivsoppholdVilkår {
  avklartSaksopplysning: LivsoppholdSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  utfallperiode: Periode;
  samletUtfall: Utfall;
}

interface LivsoppholdSaksopplysning {
  harLivsoppholdYtelser: boolean;
  saksbehandler?: Saksbehandler;
  tidspunkt: string;
  årsakTilEndringLivsopphold?: ÅrsakTilEndring;
  samletUtfall: Utfall;
}

export interface LivsoppholdSaksopplysningBody {
  ytelseForPeriode: {
    periode: Periode;
    harYtelse: boolean;
  };
}

enum ÅrsakTilEndring {
  FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
  ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}
