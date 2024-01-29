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

export enum MeldekortStatus {
  IKKE_UTFYLT = 'Ikke utfylt',
  DELTATT = 'Deltatt',
  IKKE_DELTATT = 'Ikke deltatt',
  FRAVÆR_SYK = 'Fravær syk',
  FRAVÆR_SYKT_BARN = 'Fravær sykt barn',
  FRAVÆR_VELFERD = 'Fravær velferd',
  LØNN_FOR_TID_I_ARBEID = 'Lønn for tid i arbeid',
}

export const MeldekortStatusTekster = [
  { tekst: 'Deltatt' },
  { tekst: 'Ikke deltatt' },
  { tekst: 'Lønn for tid i arbeid' },
  { tekst: 'Ikke utfylt' },
  { tekst: 'Fravær syk' },
  { tekst: 'Fravær sykt barn' },
  { tekst: 'Fravær velferd' },
];
