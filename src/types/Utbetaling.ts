import { BeløpProps } from './Beregning';
import { MeldeperiodeKjedeId } from './meldekort/Meldeperiode';
import { Periode } from './Periode';
import { SimulertBeregning } from '~/types/SimulertBeregning';

export enum Utbetalingsstatus {
    SENDT_TIL_HELVED = 'SENDT_TIL_HELVED',
    SENDT_TIL_OPPDRAG = 'SENDT_TIL_OPPDRAG',
    FEILET_MOT_OPPDRAG = 'FEILET_MOT_OPPDRAG',
    OK = 'OK',
    OK_UTEN_UTBETALING = 'OK_UTEN_UTBETALING',
    AVBRUTT = 'AVBRUTT',
    IKKE_SENDT_TIL_HELVED = 'IKKE_SENDT_TIL_HELVED',
    IKKE_GODKJENT = 'IKKE_GODKJENT',
}

export type UtbetalingstidslinjePeriode = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: BeløpProps;
    status: Utbetalingsstatus;
};

export type UtbetalingskontrollMedEndring = {
    simulertBeregning: SimulertBeregning;
    harEndringer: true;
    tidspunkt: string;
};

export type UtbetalingskontrollUtenEndring = {
    harEndringer: false;
    tidspunkt: string;
};

export type Utbetalingskontroll = UtbetalingskontrollMedEndring | UtbetalingskontrollUtenEndring;
