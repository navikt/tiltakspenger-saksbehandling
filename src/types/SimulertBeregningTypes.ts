import { BeløpProps } from '~/types/Beregning';
import { Behandlingstype, BeløpFørOgNå, BeregningerSummert } from '~/types/BehandlingTypes';
import { MeldekortBehandlingDagStatus } from '~/types/meldekort/MeldekortBehandling';

export type SimulertBeregning = {
    behandlingId: string;
    behandlingstype: Behandlingstype;
    perMeldeperiode: SimulertBeregningPerMeldeperiode[];
    beregningstidspunkt: string | null;
    simuleringstidspunkt: string | null;
    simuleringsdato: string | null;
    simuleringTotalBeløp: number | null;
    simuleringFeilutbetaling: number | null;
    simuleringEtterbetaling: number | null;
    simuleringTidligereUtbetalt: number | null;
    simuleringNyUtbetaling: number | null;
    simuleringTotalJustering: number | null;
    simuleringTotalTrekk: number | null;
    beregningEndring: BeløpProps;
}

export type SimulertBeregningPerMeldeperiode = {
    meldeperiodeKjedeId: string;
    dager: SimulertBeregningDag[];
    simuleringFeilutbetaling: number | null;
    simuleringEtterbetaling: number | null;
    simuleringTidligereUtbetalt: number | null;
    simuleringNyUtbetaling: number | null;
    simuleringTotalJustering: number | null;
    simuleringTotalTrekk: number | null;
    beregningEndring: BeløpProps;
    beregning: BeløpProps;
}

export type SimulertBeregningDag = {
    dato: string;
    status: MeldekortBehandlingDagStatus;
    simuleringFeilutbetaling: number | null;
    simuleringEtterbetaling: number | null;
    simuleringTidligereUtbetalt: number | null;
    simuleringNyUtbetaling: number | null;
    simuleringTotalJustering: number | null;
    simuleringTotalTrekk: number | null;
    beregningEndring: BeløpProps;
    beregning: BeregningerSummert;
}
