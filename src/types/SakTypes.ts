import { BehandlingData, BehandlingForOversiktData } from './BehandlingTypes';
import { MeldeperiodeKjedeProps } from './meldekort/Meldeperiode';
import { SøknadForBehandlingProps } from './SøknadTypes';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversiktData[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    førsteLovligeStansdato?: string;
    sisteDagSomGirRett?: string;
    søknader: SøknadForBehandlingProps[];
    behandlinger: BehandlingData[];
};
