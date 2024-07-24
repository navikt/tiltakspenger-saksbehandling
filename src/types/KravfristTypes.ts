import { Lovreferanse, SamletUtfall } from './BehandlingTypes';
import { Periode } from './Periode';

export interface KravfristVilkår {
  søknadSaksopplysning: KravfristSaksopplysning;
  avklartSaksopplysning: KravfristSaksopplysning;
  vilkårLovreferanse: Lovreferanse;
  utfallperiode: Periode;
  samletUtfall: SamletUtfall;
}

interface KravfristSaksopplysning {
  kravdato: string;
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
