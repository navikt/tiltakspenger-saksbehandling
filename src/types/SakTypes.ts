import { BehandlingForBenk } from './BehandlingTypes';
import { MeldeperiodeSammendragProps } from './MeldekortTypes';

export type Sak = {
    sakId: string;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForBenk[];
    meldeperiodeoversikt: MeldeperiodeSammendragProps[];
    førsteLovligeStansdato: string;
};
