import { BehandlingForBenk } from './BehandlingTypes';
import { MeldeperiodeProps } from './Meldeperiode';

export type Sak = {
    sakId: string;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForBenk[];
    meldeperiodeoversikt: MeldeperiodeProps[];
    førsteLovligeStansdato: string;
};
