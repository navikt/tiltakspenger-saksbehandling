import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { RammebehandlingId } from '../../rammebehandling/typer/Rammebehandling';
import { RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import { KlagevedtakMedBehandling } from '~/lib/klage/typer/Klagevedtak';

export type BehandlingId = RammebehandlingId | MeldekortbehandlingId;

export enum VedtakType {
    Rammebehandling = 'Rammebehandling',
    Meldekort = 'Meldekort',
    Klage = 'Klage',
}

export type RammevedtakEllerKlageMedBehandling =
    | RammevedtakMedBehandling
    | KlagevedtakMedBehandling;

export enum SaksbehandlerBehandlingKommando {
    TildelSaksbehandler = 'TildelSaksbehandler',
    TildelBeslutter = 'TildelBeslutter',
    OvertaSaksbehandler = 'OvertaSaksbehandler',
    OvertaBeslutter = 'OvertaBeslutter',
    LeggTilbakeSaksbehandler = 'LeggTilbakeSaksbehandler',
    LeggTilbakeBeslutter = 'LeggTilbakeBeslutter',
    SettPåVent = 'SettPåVent',
    Gjenoppta = 'Gjenoppta',
    Avbryt = 'Avbryt',
}
