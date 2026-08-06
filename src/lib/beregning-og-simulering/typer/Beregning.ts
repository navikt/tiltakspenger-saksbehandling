import { Periode } from '~/types/Periode';
import { MeldekortDagBeregnetProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { RammebehandlingId } from '../../rammebehandling/typer/Rammebehandling';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

export type BeløpProps = {
    totalt: number;
    ordinært: number;
    barnetillegg: number;
};

export type MeldeperiodeBeregningProps = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: BeløpProps;
    dager: MeldekortDagBeregnetProps[];
    beregningKilde: BeregningKilde;
};

export type BeregningerSummert = {
    totalt: BeløpFørOgNå;
    ordinært: BeløpFørOgNå;
    barnetillegg: BeløpFørOgNå;
};

export type BeløpFørOgNå = {
    før: Nullable<number>;
    nå: number;
};

export enum BeregningKildeType {
    MELDEKORT = 'MELDEKORT',
    RAMMEBEHANDLING = 'RAMMEBEHANDLING',
}

export type BeregningKilde =
    | { id: MeldekortbehandlingId; type: BeregningKildeType.MELDEKORT }
    | { id: RammebehandlingId; type: BeregningKildeType.RAMMEBEHANDLING };
