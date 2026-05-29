import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { RammebehandlingId } from '../../rammebehandling/typer/Rammebehandling';

export type BehandlingId = RammebehandlingId | MeldekortbehandlingId;

export enum SaksbehandlerBehandlingKommando {
    TildelSaksbehandler = 'TildelSaksbehandler',
    TildelBeslutter = 'TildelBeslutter',
    OvertaSaksbehandler = 'OvertaSaksbehandler',
    OvertaBeslutter = 'OvertaBeslutter',
    LeggTilbakeSaksbehandler = 'LeggTilbakeSaksbehandler',
    LeggTilbakeBeslutter = 'LeggTilbakeBeslutter',
    SettPåVent = 'SettPåVent',
    Gjenoppta = 'Gjenoppta',
    Avslutt = 'Avslutt',
}
