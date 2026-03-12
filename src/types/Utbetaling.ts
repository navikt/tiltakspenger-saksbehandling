import { BeløpProps } from './Beregning';
import { MeldeperiodeKjedeId } from './meldekort/Meldeperiode';
import { Periode } from './Periode';
import { SimulertBeregning } from '~/types/SimulertBeregning';
import { Nullable } from '~/types/UtilTypes';

export type UtbetalingId = `utbetaling_${string}`;

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

type UtbetalingskontrollBase = {
    tidspunkt: string;
    status: UtbetalingskontrollStatus;
};

export type UtbetalingskontrollMedEndring = UtbetalingskontrollBase & {
    simulertBeregning: SimulertBeregning;
    status: UtbetalingskontrollStatus.ENDRET;
};

export type UtbetalingskontrollUtenEndring = UtbetalingskontrollBase & {
    status: UtbetalingskontrollStatus.UENDRET;
};

export type UtbetalingskontrollUtdatert = UtbetalingskontrollBase & {
    status: UtbetalingskontrollStatus.UTDATERT;
};

export type Utbetalingskontroll =
    | UtbetalingskontrollMedEndring
    | UtbetalingskontrollUtenEndring
    | UtbetalingskontrollUtdatert;

export type BehandlingUtbetalingProps = {
    navkontor: string;
    navkontorNavn?: string;
    status: Utbetalingsstatus;
    simulertBeregning: SimulertBeregning;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
};

export enum KanIkkeIverksetteUtbetalingGrunn {
    SimuleringMangler = 'SimuleringMangler',
    FeilutbetalingStøttesIkke = 'FeilutbetalingStøttesIkke',
    JusteringStøttesIkke = 'JusteringStøttesIkke',
    SimuleringHarEndringer = 'SimuleringHarEndringer',
}

export enum UtbetalingskontrollStatus {
    ENDRET = 'ENDRET',
    UENDRET = 'UENDRET',
    UTDATERT = 'UTDATERT',
}
