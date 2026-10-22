import { BeløpProps } from '../../beregning-og-simulering/typer/Beregning';
import { Periode } from '~/types/Periode';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

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

/** Status for en utbetaling i utbetalingstidslinjen på saken. Har andre verdier enn [Utbetalingsstatus]. */
export enum UtbetalingstidslinjeStatus {
    IkkePåbegynt = 'IkkePåbegynt',
    SendtTilOppdrag = 'SendtTilOppdrag',
    FeiletMotOppdrag = 'FeiletMotOppdrag',
    Ok = 'Ok',
    OkUtenUtbetaling = 'OkUtenUtbetaling',
    Avbrutt = 'Avbrutt',
}

export type UtbetalingstidslinjePeriode = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: BeløpProps;
    /** Null før utbetalingen har fått en status. */
    status: Nullable<UtbetalingstidslinjeStatus>;
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
    UtbetalingskontrollMedEndring | UtbetalingskontrollUtenEndring | UtbetalingskontrollUtdatert;

export type BehandlingUtbetalingProps = {
    navkontor: SladdbarVerdi<string>;
    navkontorNavn: SladdbarVerdi<Nullable<string>>;
    status: Utbetalingsstatus;
    simulertBeregning: SimulertBeregning;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
    /** Melding fra backend som kan vises direkte. Null når grunnen alene er dekkende. */
    kanIkkeIverksetteUtbetalingMelding: Nullable<string>;
};

export enum KanIkkeIverksetteUtbetalingGrunn {
    SimuleringMangler = 'SimuleringMangler',
    BehandlingstypeStøtterIkkeFeilutbetaling = 'BehandlingstypeStøtterIkkeFeilutbetaling',
    BehandlingstypeStøtterIkkeJustering = 'BehandlingstypeStøtterIkkeJustering',
    JusteringStøttesIkke = 'JusteringStøttesIkke',
    SimuleringHarEndringer = 'SimuleringHarEndringer',
}

export enum UtbetalingskontrollStatus {
    ENDRET = 'ENDRET',
    UENDRET = 'UENDRET',
    UTDATERT = 'UTDATERT',
}
