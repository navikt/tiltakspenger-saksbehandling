import {
    MeldekortbehandlingId,
    MeldekortbehandlingPrefix,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { BehandlingId } from '../typer/BehandlingFelles';
import {
    RammebehandlingId,
    RammebehandlingPrefix,
} from '~/lib/rammebehandling/typer/Rammebehandling';

export const erBehandlingIdRammebehandling = (id: BehandlingId): id is RammebehandlingId =>
    id.startsWith(RammebehandlingPrefix);

export const erBehandlingIdMeldekortbehandling = (id: BehandlingId): id is MeldekortbehandlingId =>
    id.startsWith(MeldekortbehandlingPrefix);
