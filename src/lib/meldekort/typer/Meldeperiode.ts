import { Periode } from '~/types/Periode';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

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
