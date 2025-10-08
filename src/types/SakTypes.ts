import { BehandlingData, BehandlingForOversiktData } from './BehandlingTypes';
import { MeldeperiodeKjedeId, MeldeperiodeKjedeProps } from './meldekort/Meldeperiode';
import { SøknadForBehandlingProps } from './SøknadTypes';
import { Rammevedtak } from '~/types/VedtakTyper';
import { Periode } from '~/types/Periode';
import { BeløpProps } from '~/types/Beregning';
import { Utbetalingsstatus } from '~/types/meldekort/MeldekortBehandling';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;
    behandlingsoversikt: BehandlingForOversiktData[];
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    førsteDagSomGirRett?: string;
    sisteDagSomGirRett?: string;
    søknader: SøknadForBehandlingProps[];
    behandlinger: BehandlingData[];
    tidslinje: Rammevedtak[];
    utbetalingstidslinje: UtbetalingstidslinjePeriode[];
};

type UtbetalingstidslinjePeriode = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: BeløpProps;
    status: Utbetalingsstatus;
};
