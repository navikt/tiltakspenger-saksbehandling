import { ÅpenBehandlingForOversikt } from './ÅpenBehandlingForOversikt';
import { MeldeperiodeKjedeProps } from './meldekort/Meldeperiode';

import { Rammevedtak } from '~/types/Rammevedtak';

import { Søknad } from './Søknad';
import { UtbetalingstidslinjePeriode } from './Utbetaling';
import { Rammebehandling } from './Rammebehandling';
import { Tidslinje } from './Tidslinje';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    åpneBehandlinger: ÅpenBehandlingForOversikt[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    førsteDagSomGirRett?: string;
    sisteDagSomGirRett?: string;
    søknader: Søknad[];
    behandlinger: Rammebehandling[];
    tidslinje: Tidslinje;
    // Alle rammevedtak på saken med opprinnelige perioder
    alleRammevedtak: Rammevedtak[];
    utbetalingstidslinje: UtbetalingstidslinjePeriode[];
    kanSendeInnHelgForMeldekort: boolean;
};
