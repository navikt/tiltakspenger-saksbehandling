import { MeldekortStatus } from '../utils/meldekortStatus';
import { Periode } from './Periode';

export type MeldekortListe = {
  meldekort: Meldekort[];
};

export type MeldekortUtenDager = {
  id: string;
  fom: string;
  tom: string;
  status: string;
};

export type Meldekort = {
  id: string;
  fraOgMed: string;
  tilOgMed: string;
  antallDagerPåTiltaket: number;
  meldekortDager: MeldekortDag[];
};

export type MeldekortDag = {
  dato: string;
  status: MeldekortStatus;
};

export type Tiltak = {
  id: string;
  periode: Periode;
  typeBeskrivelse: string;
  typeKode: string;
  antDagerIUken: number;
};

export type GodkjennDTO = {
  meldekortId: string;
  meldekortDager: MeldekortDagDTO[];
};

export type MeldekortDagDTO = {
  dato: string;
  status: MeldekortStatus;
};


//  export type MeldekortBeregningDTO = {
//    antallDeltattUtenLønn: number;
//    antallDeltattMedLønn: number;
//    antallIkkeDeltatt: number;
//    antallSykDager: number;
//    antallSykBarnDager: number;
//    antallVelferdGodkjentAvNav: number;
//    antallVelferdIkkeGodkjentAvNav: number;
//    antallFullUtbetaling: number;
//    antallDelvisUtbetaling: number;
//    antallIngenUtbetaling: number;
//    sumDelvis: number;
//    sumFull: number;
//    sumTotal: number;
//  };
