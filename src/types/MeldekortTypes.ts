import { Periode } from './Periode';

export type Meldekortoppsummering = {
  meldekortId: string;
  periode: Periode;
  erUtfylt: boolean;
};

export type Meldekort = {
  id: string;
  periode: Periode;
  meldekortDager: MeldekortDag[];
  tiltakstype: Tiltakstype;
  saksbehandler?: string;
  beslutter?: string;
  status: Meldekortstatus;
};

export enum Meldekortstatus {
  KLAR_TIL_UTFYLLING = 'KLAR_TIL_UTFYLLING',
  KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
  GODKJENT = 'GODKJENT',
}

export type MeldekortDag = {
  dato: string;
  status: MeldekortdagStatus;
};

export enum Tiltakstype {
  ARBEIDSFORBEREDENDE_TRENING,
  ARBEIDSRETTET_REHABILITERING,
  ARBEIDSTRENING,
  AVKLARING,
  DIGITAL_JOBBKLUBB,
  ENKELTPLASS_AMO,
  ENKELTPLASS_VGS_OG_HØYERE_YRKESFAG,
  FORSØK_OPPLÆRING_LENGRE_VARIGHET,
  GRUPPE_AMO,
  GRUPPE_VGS_OG_HØYERE_YRKESFAG,
  HØYERE_UTDANNING,
  INDIVIDUELL_JOBBSTØTTE,
  INDIVIDUELL_KARRIERESTØTTE_UNG,
  JOBBKLUBB,
  OPPFØLGING,
  UTVIDET_OPPFØLGING_I_NAV,
  UTVIDET_OPPFØLGING_I_OPPLÆRING,
}

export type MeldekortDTO = {
  dager: MeldekortDag[];
};

export enum MeldekortdagStatus {
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

export const Meldekortstatuser = Object.values(MeldekortdagStatus).filter(
  (status) =>
    ![MeldekortdagStatus.Sperret, MeldekortdagStatus.IkkeUtfylt].includes(
      status,
    ),
);

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
