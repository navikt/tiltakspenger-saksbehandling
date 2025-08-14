import { MeldeperiodeKjedeId } from '~/types/meldekort/Meldeperiode';
import { Periode } from '~/types/Periode';
import { MeldekortDagBeregnetProps } from '~/types/meldekort/MeldekortBehandling';

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
