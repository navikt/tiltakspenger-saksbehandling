import { BehandlingForOversiktData } from './BehandlingTypes';
import { MeldeperiodeProps } from './meldekort/Meldeperiode';

export type SakId = `sak_${string}`;

export type Sak = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversiktData[];
    meldeperiodeoversikt: MeldeperiodeProps[];
    førsteLovligeStansdato: string;
};
