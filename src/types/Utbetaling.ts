import { BeløpProps } from './Beregning';
import { MeldeperiodeKjedeId } from './meldekort/Meldeperiode';
import { Periode } from './Periode';

export enum Utbetalingsstatus {
    SENDT_TIL_HELVED = 'SENDT_TIL_HELVED',
    SENDT_TIL_OPPDRAG = 'SENDT_TIL_OPPDRAG',
    FEILET_MOT_OPPDRAG = 'FEILET_MOT_OPPDRAG',
    OK = 'OK',
    OK_UTEN_UTBETALING = 'OK_UTEN_UTBETALING',
    AVBRUTT = 'AVBRUTT',
    IKKE_SENDT_TIL_HELVED = 'IKKE_SENDT_TIL_HELVED',
}

export type UtbetalingstidslinjePeriode = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: BeløpProps;
    status: Utbetalingsstatus;
};
