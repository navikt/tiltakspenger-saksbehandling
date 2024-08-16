export type UtbetalingListe = {
  id: string;
  fom: string;
  tom: string;
  beløp: number;
};

export type UtbetalingVedtak = {
  id: String;
  fom: string;
  tom: string;
  sats: number;
  satsDelvis: number;
  satsBarnetillegg: number;
  satsBarnetilleggDelvis: number;
  antallBarn: number;
  totalbeløp: number;
  vedtakDager: UtbetalingsDagDTO[];
};

export type UtbetalingsDagDTO = {
  beløp: number;
  dato: string;
  tiltakType: String;
  status: UtbetalingsDagStatus;
};

export enum UtbetalingsDagStatus {
  IngenUtbetaling = 'IngenUtbetaling',
  FullUtbetaling = 'FullUtbetaling',
  DelvisUtbetaling = 'DelvisUtbetaling',
}
