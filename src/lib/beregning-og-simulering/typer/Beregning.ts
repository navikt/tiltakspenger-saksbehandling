import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { Periode } from '~/types/Periode';
import { MeldekortDagBeregnetProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BehandlingId } from '../../rammebehandling/typer/Rammebehandling';

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
    | { id: BehandlingId; type: BeregningKildeType.RAMMEBEHANDLING };
