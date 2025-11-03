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
    beregningstidspunkt: null;
    beregning: BeregningerSummert;
    simuleringstidspunkt: null;
    simuleringsdato: Nullable<string>;
    simuleringTotalBeløp: Nullable<number>;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    simuleringResultat: SimuleringResultat;
}

interface SimulertBeregningMedEndring extends SimulertBeregningBase {
    simuleringsdato: string;
    simuleringTotalBeløp: number;
    simulerteBeløp: SimulerteBeløp;
    simuleringResultat: SimuleringResultat.ENDRING;
}

interface SimulertBeregningIngenEndring extends SimulertBeregningBase {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
    simuleringResultat: SimuleringResultat.INGEN_ENDRING;
}

interface SimulertBeregningUtenSimulering extends SimulertBeregningBase {
    simuleringsdato: null;
    simuleringTotalBeløp: null;
    simulerteBeløp: null;
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
    status: MeldekortBehandlingDagStatus;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    beregning: BeregningerSummert;
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
