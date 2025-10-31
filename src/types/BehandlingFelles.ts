import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { BehandlingId } from './Rammebehandling';

export type BehandlingIdFelles = BehandlingId | MeldekortBehandlingId;
