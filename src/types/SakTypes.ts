import { BehandlingForOversiktProps } from './BehandlingTypes';
import { MeldeperiodeProps } from './meldekort/Meldeperiode';

export type SakId = `sak_${string}`;

export type Sak = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversiktProps[];
    meldeperiodeoversikt: MeldeperiodeProps[];
    førsteLovligeStansdato: string;
};
