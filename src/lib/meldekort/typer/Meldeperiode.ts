import { Periode } from '~/types/Periode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    BrukersMeldekortKjedeStatus,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldeperiodeBeregningProps } from '~/lib/beregning-og-simulering/typer/Beregning';

export type MeldeperiodeKjedeId = `${string}/${string}`;

export type MeldeperiodeId = `meldeperiode_${string}`;

export type MeldeperiodeProps = {
    id: MeldeperiodeId;
    versjon: number;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    opprettet: string;
    antallDager: number;
    girRett: Record<string, boolean>;
    ingenDagerGirRett: boolean;
};

export type MeldeperiodekjedeProps = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    tiltaksnavn: string[];
    sisteMeldeperiode: MeldeperiodeProps;
    // Sortert på opprettet tidspunkt
    meldekortbehandlingIder: MeldekortbehandlingId[];
    meldekortbehandlingStatus: MeldekortbehandlingStatus | null;
    brukersMeldekort: BrukersMeldekortProps[];
    brukersMeldekortStatus: BrukersMeldekortKjedeStatus;
    gjeldendeBeregning: MeldeperiodeBeregningProps | null;
    /** Satt kun når kjeden ikke kan behandles */
    kanIkkeBehandlesGrunn: KanIkkeBehandlesGrunn | null;
    åpenBehandlingId: MeldekortbehandlingId | null;
};

export enum KanIkkeBehandlesGrunn {
    /** Kjeden er allerede omfattet av en åpen meldekortbehandling, og en kjede kan bare være under behandling ett sted om gangen. */
    HAR_ÅPEN_BEHANDLING = 'HAR_ÅPEN_BEHANDLING',
    MELDEPERIODEN_HAR_IKKE_STARTET = 'MELDEPERIODEN_HAR_IKKE_STARTET',
    INGEN_DAGER_GIR_RETT = 'INGEN_DAGER_GIR_RETT',
}
