import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BehandlingId } from '../../rammebehandling/typer/Rammebehandling';

export type BehandlingIdFelles = BehandlingId | MeldekortbehandlingId;

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
