import { MeldekortbehandlingProps } from '~/types/meldekort/Meldekortbehandling';

export const sorterMeldekortbehandlingerAsc = (
    a: MeldekortbehandlingProps,
    b: MeldekortbehandlingProps,
) => (a.opprettet > b.opprettet ? -1 : 1);
