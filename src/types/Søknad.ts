import { Periode } from './Periode';
import Tiltaksstatus from './Tiltaksstatus';

export type RegistrertTiltak = {
  arrangør: string;
  dagerIUken: number;
  navn: string;
  periode: Periode;
  prosent: number;
  status: Tiltaksstatus;
};

interface Søknad {
  søknadsdato: string;
  arrangoernavn: string;
  tiltakstype: string;
  deltakelseFom: string;
  deltakelseTom: string;
}

export default Søknad;
