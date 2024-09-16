import { BehandlingForBenk } from './BehandlingTypes';
import { Meldekortsammendrag } from './MeldekortTypes';

export type Sak = {
  sakId: string;
  saksnummer: string;
  fnr: string;
  behandlingsoversikt: BehandlingForBenk[];
  meldekortoversikt: Meldekortsammendrag[];
};
