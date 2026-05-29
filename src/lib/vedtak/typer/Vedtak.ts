import { MeldekortVedtak } from '~/lib/meldekort/typer/MeldekortVedtak';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';

export type Vedtak = Rammevedtak | MeldekortVedtak;
