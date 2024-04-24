import { Periode } from '../../types/Periode';

export interface Tiltaksdeltagelse {
  periode: Periode;
  antallDagerIUken: number;
  status: String;
}
