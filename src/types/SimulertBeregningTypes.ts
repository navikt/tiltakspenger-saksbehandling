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

export type SimulertBeregning = {
    behandlingId: MeldekortBehandlingId | BehandlingId;
    behandlingstype: SimulerertBehandlingstype;
    meldeperioder: SimulertBeregningPerMeldeperiode[];
    beregningstidspunkt: Nullable<string>;
    simuleringstidspunkt: Nullable<string>;
    simuleringsdato: Nullable<string>;
    simuleringTotalBeløp: Nullable<number>;
    simulerteBeløp: Nullable<SimulerteBeløp>;
    beregning: BeregningerSummert;
};

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
