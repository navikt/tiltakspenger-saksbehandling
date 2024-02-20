

export type UtbetalingListe = {
    id: string;
    fom: Date;
    tom: Date;
    beløp: number;
};

export type UtbetalingVedtak = {
    id: String,
    fom: Date,
    tom: Date,
    sats: number,
    satsBarnetillegg: number,
    antallBarn: number,
    totalbeløp: number,
    vedtakDager: UtbetalingsDagDTO[];
}

export type UtbetalingsDagDTO = {
    beløp: number,
    dato: Date,
    tiltakType: String,
    status: UtbetalingsDagStatus
}

export enum UtbetalingsDagStatus {
    IngenUtbetaling = 'IngenUtbetaling',
    FullUtbetaling = 'FullUtbetaling',
    DelvisUtbetaling = 'DelvisUtbetaling',
}

