import { Periode } from './Periode';
import Tiltaksstatus from './Tiltaksstatus';
import { Utfall } from './Utfall';

export type RegistrertTiltak = {
  id: string;
  arrangør: string;
  navn: string;
  periode: Periode;
  status: Tiltaksstatus;
  girRett: boolean;
  harSøkt: boolean;
  kilde: string;
  deltagelseUtfall: Utfall;
  begrunnelse: string;
};

interface Søknad {
  søknadsdato: string;
  arrangoernavn: string;
  tiltakstype: string;
  deltakelseFom: string;
  deltakelseTom: string;
}

export default Søknad;
