import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';

export const sorterMeldekortbehandlingerAsc = (
    a: MeldekortbehandlingProps,
    b: MeldekortbehandlingProps,
) => (a.opprettet > b.opprettet ? -1 : 1);
