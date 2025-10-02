import { Periode } from './Periode';

export type Simulering = SimuleringIngenEndring | SimuleringEndring;

export interface SimuleringIngenEndring {
    type: 'IngenEndring';
}

export interface SimuleringEndring {
    totalPeriode: Periode;
    perMeldeperiode: SimuleringMeldeperiodeProps[];
    tidligereUtbetalt: number;
    nyUtbetaling: number;
    totalEtterbetaling: number;
    totalFeilutbetaling: number;
    totalTrekk: number;
    totalJustering: number;
    totalBeløp: number;
    datoBeregnet: string;
    type: 'Endring';
}

export interface SimuleringMeldeperiodeProps {
    meldeperiodeId: string;
    meldeperiodeKjedeId: string;
    periode: Periode;
    simuleringsdager: Simuleringsdag[];
}

export interface Simuleringsdag {
    dato: string;
    tidligereUtbetalt: number;
    nyUtbetaling: number;
    totalEtterbetaling: number;
    totalFeilutbetaling: number;
    totalTrekk: number;
    totalJustering: number;
    posteringsdag: PosteringerForDag;
}

export interface PosteringerForDag {
    dato: string;
    posteringer: PosteringForDag[];
}

export interface PosteringForDag {
    dato: string;
    fagområde: string;
    beløp: number;
    type: string;
    klassekode: string;
}
