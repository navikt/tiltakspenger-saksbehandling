import { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';

export type Vedtak = Rammevedtak | Meldekortvedtak;
