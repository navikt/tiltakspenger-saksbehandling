import { Periode } from '~/types/Periode';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';
import { Dato, Tidspunkt } from '~/types/DatoTid';

export type MeldeperiodeId = `meldeperiode_${string}`;

export type MeldeperiodeProps = {
    id: MeldeperiodeId;
    versjon: number;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    opprettet: Tidspunkt;
    antallDager: number;
    girRett: Record<Dato, boolean>;
    ingenDagerGirRett: boolean;
};
