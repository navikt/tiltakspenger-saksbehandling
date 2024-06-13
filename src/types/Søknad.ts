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

export interface AntallDagerSaksopplysninger {
  antallDagerSaksopplysningerFraSBH: AntallDagerSaksopplysning[];
  antallDagerSaksopplysningerFraRegister: AntallDagerSaksopplysning[];
  avklartAntallDager: AntallDagerSaksopplysning[];
}

export interface AntallDagerSaksopplysning {
  antallDager: number;
  kilde: string;
  periode: Periode;
}

interface Søknad {
  søknadsdato: string;
  arrangoernavn: string;
  tiltakstype: string;
  deltakelseFom: string;
  deltakelseTom: string;
}

export default Søknad;
