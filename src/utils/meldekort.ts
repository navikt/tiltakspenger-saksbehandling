import { MeldekortBehandlingProps } from '../types/meldekort/MeldekortBehandling';

export const sorterMeldekortBehandlingerAsc = (
    a: MeldekortBehandlingProps,
    b: MeldekortBehandlingProps,
) => (a.opprettet > b.opprettet ? -1 : 1);
