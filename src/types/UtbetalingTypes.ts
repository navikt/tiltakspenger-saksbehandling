import { BeløpProps } from './Beregning';
import { Periode } from './Periode';

export interface UtbetalingstidslinjePeriode {
    kjedeId: string;
    periode: Periode;
    beløp: BeløpProps;
    status: string;
}
