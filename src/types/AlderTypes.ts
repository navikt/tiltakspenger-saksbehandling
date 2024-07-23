import { Lovreferanse, SamletUtfall } from './BehandlingTypes';
import { Periode } from './Periode';

export interface AlderVilkår {
  søknadSaksopplysning: AlderSaksopplysning;
  avklartSaksopplysning: AlderSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  vurderingsperiode: Periode;
  samletUtfall: SamletUtfall;
}

interface AlderSaksopplysning {
  fødselsdato: string;
  årsakTilEndring?: ÅrsakTilEndring;
  kilde: Kilde;
}

enum Kilde {
  SØKNAD = 'SØKNAD',
}

enum ÅrsakTilEndring {
  FEIL_I_INNHENTET_DATA = 'FEIL_I_INNHENTET_DATA',
  ENDRING_ETTER_SØKNADSTIDSPUNKT = 'ENDRING_ETTER_SØKNADSTIDSPUNKT',
}
