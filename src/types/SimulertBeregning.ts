import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingId,
} from '~/types/meldekort/MeldekortBehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeId } from '~/types/meldekort/Meldeperiode';
import { BeregningerSummert } from '~/types/Beregning';
import { BehandlingId } from './Rammebehandling';

export enum SimulerertBehandlingstype {
    RAMME = 'RAMME',
    MELDERKORT = 'MELDEKORT',
}

interface SimulertBeregningBase {
    behandlingId: MeldekortBehandlingId | BehandlingId;
    behandlingstype: SimulerertBehandlingstype;
    meldeperioder: SimulertBeregningPerMeldeperiode[];
    beregningstidspunkt: string;
    beregning: BeregningerSummert;
    simuleringstidspunkt: Nullable<string>;
    simuleringsdato: Nullable<string>;
    simuleringTotalBeløp: Nullable<number>;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    simuleringResultat: SimuleringResultat;
}

interface SimulertBeregningMedEndring extends SimulertBeregningBase {
    simuleringsdato: string;
    simuleringTotalBeløp: number;
    simuleringstidspunkt: string;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    simuleringResultat: SimuleringResultat.ENDRING;
}

interface SimulertBeregningIngenEndring extends SimulertBeregningBase {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
    simuleringstidspunkt: string;
    simuleringResultat: SimuleringResultat.INGEN_ENDRING;
}

interface SimulertBeregningUtenSimulering extends SimulertBeregningBase {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
    simuleringstidspunkt: null;
    simuleringResultat: SimuleringResultat.IKKE_SIMULERT;
}

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
    status: MeldekortBehandlingDagStatus;
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
