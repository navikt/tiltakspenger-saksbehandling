import { Lovreferanse, SamletUtfall } from './BehandlingTypes';
import { Periode } from './Periode';
import { Saksbehandler } from './Saksbehandler';

export interface LivsoppholdVilkår {
  avklartSaksopplysning: LivsoppholdSaksopplysning;
  vurderingsPeriode: Periode;
  vilkårLovreferanse: Lovreferanse;
  samletUtfall: SamletUtfall;
}

interface LivsoppholdSaksopplysning {
  harLivsoppholdYtelser: Boolean;
  vurderingsPeriode: Periode;
  saksbehandler?: Saksbehandler;
  årsakTilEndring?: ÅrsakTilEndring;
  tidspunkt: string;
}

enum ÅrsakTilEndring {
  FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
  ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}
