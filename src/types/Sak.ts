import { BehandlingForOversikt } from './BehandlingForOversikt';
import { MeldeperiodeKjedeProps } from './meldekort/Meldeperiode';

import { Rammevedtak } from '~/types/Vedtak';

import { Søknad } from './Søknad';
import { UtbetalingstidslinjePeriode } from './Utbetaling';
import { Rammebehandling } from './Behandling';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversikt[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    førsteDagSomGirRett?: string;
    sisteDagSomGirRett?: string;
    søknader: Søknad[];
    behandlinger: Rammebehandling[];
    tidslinje: Rammevedtak[];
    utbetalingstidslinje: UtbetalingstidslinjePeriode[];
    kanSendeInnHelgForMeldekort: boolean;
};
