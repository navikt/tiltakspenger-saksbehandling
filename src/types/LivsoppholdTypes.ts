import { Lovreferanse, SamletUtfall } from './BehandlingTypes';
import { Periode } from './Periode';
import { Saksbehandler } from './Saksbehandler';

export interface LivsoppholdVilkår {
  harLivsoppholdYtelser: Boolean;
  vurderingsPeriode: Periode;
  saksbehandler?: Saksbehandler;
  vilkårLovreferanse: Lovreferanse;
  tidspunkt: string;
  årsakTilEndringLivsopphold?: ÅrsakTilEndring;
  samletUtfall: SamletUtfall;
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
