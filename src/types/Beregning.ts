import { MeldeperiodeKjedeId } from '~/types/meldekort/Meldeperiode';
import { Periode } from '~/types/Periode';
import { MeldekortDagBeregnetProps } from '~/types/meldekort/MeldekortBehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { BehandlingId } from './Rammebehandling';

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
    | { id: MeldekortBehandlingId; type: BeregningKildeType.MELDEKORT }
    | { id: BehandlingId; type: BeregningKildeType.RAMMEBEHANDLING };
