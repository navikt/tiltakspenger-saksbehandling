import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingId,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { BeregningerSummert } from '~/lib/beregning-og-simulering/typer/Beregning';
import { RammebehandlingId } from '../../rammebehandling/typer/Rammebehandling';

export enum SimulerertBehandlingstype {
    RAMME = 'RAMME',
    MELDERKORT = 'MELDEKORT',
}

type SimulertBeregningBase = {
    behandlingId: MeldekortbehandlingId | RammebehandlingId;
    behandlingstype: SimulerertBehandlingstype;
    meldeperioder: SimulertBeregningPerMeldeperiode[];
    beregningstidspunkt: string;
    beregning: BeregningerSummert;
    simuleringstidspunkt: Nullable<string>;
    simuleringsdato: Nullable<string>;
    simuleringTotalBeløp: Nullable<number>;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    simuleringResultat: SimuleringResultat;
};

type SimulertBeregningMedEndring = SimulertBeregningBase & {
    simuleringsdato: string;
    simuleringTotalBeløp: number;
    simuleringstidspunkt: string;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    simuleringResultat: SimuleringResultat.ENDRING;
};

type SimulertBeregningIngenEndring = SimulertBeregningBase & {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
    simuleringstidspunkt: string;
    simuleringResultat: SimuleringResultat.INGEN_ENDRING;
};

type SimulertBeregningUtenSimulering = SimulertBeregningBase & {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
    simuleringstidspunkt: null;
    simuleringResultat: SimuleringResultat.IKKE_SIMULERT;
};

export type SimulertBeregning =
    | SimulertBeregningMedEndring
    | SimulertBeregningIngenEndring
    | SimulertBeregningUtenSimulering;

export type SimulertBeregningPerMeldeperiode = {
    kjedeId: MeldeperiodeKjedeId;
    dager: SimulertBeregningDag[];
    simulerteBeløp: Nullable<SimulerteBeløp>;
    beregning: BeregningerSummert;
};

export type SimulertBeregningDag = {
    dato: string;
    simulerteBeløp: Nullable<SimulerteBeløp>;
} & (SimulertBeregningDagMedBeregning | SimulertBeregningDagUtenBeregning);

export type SimulertBeregningDagMedBeregning = {
    status: MeldekortbehandlingDagStatus;
    beregning: BeregningerSummert;
};

export type SimulertBeregningDagUtenBeregning = {
    status: null;
    beregning: null;
};

export type SimulerteBeløp = {
    feilutbetaling: number;
    etterbetaling: number;
    tidligereUtbetaling: number;
    nyUtbetaling: number;
    totalJustering: number;
    totalTrekk: number;
};

export enum SimuleringResultat {
    ENDRING = 'ENDRING',
    INGEN_ENDRING = 'INGEN_ENDRING',
    IKKE_SIMULERT = 'IKKE_SIMULERT',
}
