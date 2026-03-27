import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { BehandlingId } from './Rammebehandling';

export type BehandlingIdFelles = BehandlingId | MeldekortBehandlingId;

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
