import { Periode } from './Periode';

export type Meldekortsammendrag = {
  meldekortId: string;
  periode: Periode;
  status: Meldekortstatus;
  saksbehandler?: string;
  beslutter?: string;
};

export type Meldekort = {
  id: string;
  rammevedtakId: string;
  periode: Periode;
  meldekortDager: MeldekortDag[];
  tiltakstype: Tiltakstype;
  saksbehandler?: string;
  beslutter?: string;
  status: Meldekortstatus;
  totalbeløpTilUtbetaling: number;
  sakPeriode: Periode
};

export enum Meldekortstatus {
  KLAR_TIL_UTFYLLING = 'KLAR_TIL_UTFYLLING',
  KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
  GODKJENT = 'GODKJENT',
}

export type MeldekortDag = {
  dato: string;
  status: MeldekortdagStatus;
  reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
  beregningsdag: Beregningsdag;
};

export type Beregningsdag = {
  beløp: number;
  prosent: number;
};

export type MeldekortDagDTO = {
  dato: string;
  status: MeldekortdagStatus;
};

export type Sats = {
  periode: Periode;
  sats: number;
  satsDelvis: number;
};

export enum ReduksjonAvYtelse {
  INGEN_REDUKSJON = 'INGEN_REDUKSJON',
  DELVIS_REDUKSJON = 'DELVIS_REDUKSJON',
  YTELSEN_FALLER_BORT = 'YTELSEN_FALLER_BORT',
}

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
  dager: MeldekortDagDTO[];
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
