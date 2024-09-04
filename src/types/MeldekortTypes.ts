import { Periode } from './Periode';

export type MeldekortUtenDager = {
  meldekortId: string;
  periode: Periode;
  erUtfylt: boolean;
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

export type MeldekortDTO = {
  dager: MeldekortDag[];
};

export type GodkjennDTO = {
  meldekortId: string;
  meldekortDager: MeldekortDag[];
};

export enum MeldekortStatus {
  Sperret = 'SPERRET',
  IkkeUtfylt = 'IKKE_UTFYLT',
  DeltattUtenLønnITiltaket = 'DELTATT_UTEN_LØNN_I_TILTAKET',
  DeltattMedLønnITiltaket = 'DELTATT_MED_LØNN_I_TILTAKET',
  IkkeDeltatt = 'IKKE_DELTATT',
  FraværSyk = 'FRAVÆR_SYK',
  FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
  FraværVelferdGodkjentAvNav = 'FRAVÆR_VELFERD_GODKJENT_AV_NAV',
  FraværVelferdIkkeGodkjentAvNav = 'FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV',
}

export const Meldekortstatuser = Object.values(MeldekortStatus);

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
