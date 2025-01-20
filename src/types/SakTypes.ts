import { BehandlingForBenk } from './BehandlingTypes';
import { Meldekortsammendrag, MeldeperiodeSammendrag } from './MeldekortTypes';

export type Sak = {
    sakId: string;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForBenk[];
    meldekortoversikt: Meldekortsammendrag[];
    meldeperiodeoversikt: MeldeperiodeSammendrag[];
    førsteLovligeStansdato: string;
};
