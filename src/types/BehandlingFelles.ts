import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { BehandlingId } from './Behandling';

export type BehandlingIdFelles = BehandlingId | MeldekortBehandlingId;
