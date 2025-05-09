import { Periode } from './Periode';

export interface Simuleringsdetaljer {
    oppsummeringForPerioder: Simuleringsperiode[];
    detaljer: Simuleringsdetalje;
}
export interface Simuleringsperiode {
    periode: Periode;
    tidligereUtbetalt: number;
    nyUtbetaling: number;
    totalEtterbetaling: number;
    totalFeilutbetaling: number;
}

export interface Simuleringsdetalje {
    datoBeregnet: string;
    totalBeløp: number;
    perioder: SimuleringsdetaljePeriode[];
}

export interface SimuleringsdetaljePeriode {
    periode: Periode;
    delperiode: DelperiodeSimulering[];
}

export interface DelperiodeSimulering {
    fagområde: string;
    periode: Periode;
    beløp: number;
    type: string;
    klassekode: string;
}
