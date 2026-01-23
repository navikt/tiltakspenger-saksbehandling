import { ÅpenBehandlingForOversikt } from './ÅpenBehandlingForOversikt';
import { MeldeperiodeKjedeProps } from './meldekort/Meldeperiode';
import { Rammevedtak } from '~/types/Rammevedtak';
import { UtbetalingstidslinjePeriode } from './Utbetaling';
import { Rammebehandling } from './Rammebehandling';
import { TidslinjeRammevedtak } from './TidslinjeRammevedtak';
import { Klagebehandling } from './Klage';
import { Klagevedtak } from './Klagevedtak';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    åpneBehandlinger: ÅpenBehandlingForOversikt[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    førsteDagSomGirRett?: string;
    sisteDagSomGirRett?: string;
    behandlinger: Rammebehandling[];
    klageBehandlinger: Klagebehandling[];
    tidslinje: TidslinjeRammevedtak;
    innvilgetTidslinje: TidslinjeRammevedtak;
    // Alle rammevedtak på saken med opprinnelige perioder
    alleRammevedtak: Rammevedtak[];
    alleKlagevedtak: Klagevedtak[];
    utbetalingstidslinje: UtbetalingstidslinjePeriode[];
    kanSendeInnHelgForMeldekort: boolean;
};
