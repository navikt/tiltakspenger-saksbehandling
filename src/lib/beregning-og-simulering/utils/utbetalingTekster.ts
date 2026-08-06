import { Utbetalingsstatus } from '~/lib/_felles/utbetaling/utbetalingTyper';

export const utbetalingsstatusTekst: Record<Utbetalingsstatus, string> = {
    [Utbetalingsstatus.FEILET_MOT_OPPDRAG]: 'Feilet mot oppdrag',
    [Utbetalingsstatus.IKKE_SENDT_TIL_HELVED]: 'Ikke sendt til helved',
    [Utbetalingsstatus.OK]: 'Sendt til utbetaling',
    [Utbetalingsstatus.OK_UTEN_UTBETALING]: 'Ok uten utbetaling',
    [Utbetalingsstatus.SENDT_TIL_HELVED]: 'Venter på helved',
    [Utbetalingsstatus.SENDT_TIL_OPPDRAG]: 'Venter på oppdrag',
    [Utbetalingsstatus.AVBRUTT]: 'Avbrutt',
    [Utbetalingsstatus.IKKE_GODKJENT]: 'Ikke godkjent',
} as const;
