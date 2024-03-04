import { Periode } from './Periode';

export type MeldekortListe = {
  meldekort: Meldekort[];
};

export type MeldekortUtenDager = {
  id: string;
  fom: Date;
  tom: Date;
  status: string;
};

export type Meldekort = {
  id: string;
  fom: Date;
  tom: Date;
  antallDagerPåTiltaket: number;
  tiltak: Tiltak[];
  meldekortDager: MeldekortDag[];
};

export type MeldekortDag = {
  dato: Date;
  tiltak: Tiltak;
  status: MeldekortStatus;
};

export type Tiltak = {
  id: string;
  periode: Periode;
  typeBeskrivelse: string;
  typeKode: string;
  antDagerIUken: number;
};

export type MeldekortDagDTO = {
  meldekortId: string;
  tiltakId: string;
  dato: Date;
  status: MeldekortStatus;
}

export enum MeldekortStatus {
  IkkeUtfylt = 'IKKE_UTFYLT',
  Deltatt = 'DELTATT',
  IkkeDeltatt = 'IKKE_DELTATT',
  FraværSyk = 'FRAVÆR_SYK',
  FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
  FraværVelferd = 'FRAVÆR_VELFERD',
  Lønn = 'LØNN_FOR_TID_I_ARBEID',
}

export const MeldekortStatusTekster = [
  'Deltatt',
  'Ikke deltatt',
  'Lønn for tid i arbeid',
  'Fravær syk',
  'Fravær sykt barn',
  'Fravær velferd',
];

export type MeldekortBeregningDTO = {
    antallDeltatt: number;
    antallIkkeDeltatt: number;
    antallSykDager: number;
    antallSykBarnDager: number;
    antallVelferd: number;
    antallFullUtbetaling: number;
    antallDelvisUtbetaling: number;
    antallIngenUtbetaling: number;
    sumDelvis: number;
    sumFull: number;
    sumTotal: number;
}
