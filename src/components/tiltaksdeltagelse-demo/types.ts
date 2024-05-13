import { Periode } from '../../types/Periode';

export interface TiltaksdeltagelseDTO {
  deltagelsesperioder: Deltagelsesperiode[];
  tiltaksvariant: string;
  status: string;
  periode: Periode;
  antallDager: number;
  harSøkt: boolean;
  girRett: boolean;
  kilde: string;
}

export interface Deltagelsesperiode {
  periode: Periode;
  antallDager: number;
  status: String;
}

export const tiltaksdeltagelseDTO = [
  {
    deltagelsesperioder: [
      {
        periode: { fra: '01.01.2024', til: '01.05.2024' },
        antallDager: 3,
        status: 'Deltar',
      },
    ],
    tiltaksvariant: 'Gruppe AMO',
    status: 'Deltar',
    periode: { fra: '01.01.2024', til: '01.05.2024' },
    antallDager: 3,
    harSøkt: true,
    girRett: true,
    kilde: 'KOMET',
  },
];
