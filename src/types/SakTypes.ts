import { BehandlingForOversikt } from './BehandlingTypes';
import { MeldeperiodeProps } from './meldekort/Meldeperiode';

export type SakId = `sak_${string}`;

export type Sak = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversikt[];
    meldeperiodeoversikt: MeldeperiodeProps[];
    førsteLovligeStansdato: string;
};
