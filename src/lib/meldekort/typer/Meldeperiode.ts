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
    meldekortbehandlingIder: MeldekortbehandlingId[];
    meldekortbehandlingStatus: MeldekortbehandlingStatus | null;
    brukersMeldekort: BrukersMeldekortProps[];
    brukersMeldekortStatus: BrukersMeldekortKjedeStatus;
    gjeldendeBeregning: MeldeperiodeBeregningProps | null;
    erKlarTilUtfylling: boolean;
    kanBehandles: boolean;
};
