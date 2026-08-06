import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingId,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable } from '~/types/UtilTypes';
import { BeregningerSummert } from '~/lib/beregning-og-simulering/typer/Beregning';
import { RammebehandlingId } from '../../rammebehandling/typer/Rammebehandling';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

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
    flagg: Simuleringsflagg;
    posteringer: Simuleringspostering[];
};

export type SimulertBeregningDag = {
    dato: string;
    merker: Simuleringsmerke[];
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

/**
 * Fakta om hva simuleringen sier om en meldeperiode.
 * Backend svarer på hva som er sant; her avgjør vi hvor høyt det skal rope.
 */
export type Simuleringsflagg = {
    harJustering: boolean;
    justeringGårOppINull: boolean;
    justeringPåTversAvMeldeperiodeEllerMåned: boolean;
    harFeilutbetaling: boolean;
    harTrekk: boolean;
};

/**
 * Hva oppdragssystemet har å melde om én dag i beregningen.
 * Perioden er kildedata og kan alltid vises.
 * Beløpet er satt kun når posteringen dekker nøyaktig én dag -- for lengre perioder finnes det ingen dagsandel, og perioden vises i stedet.
 * Fortegnet er kildedata på posteringen og er satt også når beløpet er null.
 */
export type Simuleringsmerke = {
    type: Posteringstype;
    periodeFraOgMed: string;
    periodeTilOgMed: string;
    klassekode: string;
    beløp: Nullable<number>;
    erJustering: boolean;
    erNegativt: boolean;
};

/**
 * Én postering slik oppdragssystemet sendte den, knyttet til meldeperioden den treffer.
 * Beløpet er alltid kildens eget for posteringens periode -- her finnes ingen dagsfordeling.
 */
export type Simuleringspostering = {
    type: Posteringstype;
    periodeFraOgMed: string;
    periodeTilOgMed: string;
    klassekode: string;
    beløp: number;
    erJustering: boolean;
};

export enum Posteringstype {
    YTELSE = 'YTELSE',
    FEILUTBETALING = 'FEILUTBETALING',
    FORSKUDSSKATT = 'FORSKUDSSKATT',
    JUSTERING = 'JUSTERING',
    TREKK = 'TREKK',
    MOTPOSTERING = 'MOTPOSTERING',
}

export enum SimuleringResultat {
    ENDRING = 'ENDRING',
    INGEN_ENDRING = 'INGEN_ENDRING',
    IKKE_SIMULERT = 'IKKE_SIMULERT',
}
