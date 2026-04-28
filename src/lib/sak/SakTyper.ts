import { ÅpenBehandlingForOversikt } from '../personoversikt/typer/ÅpenBehandlingForOversikt';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { UtbetalingstidslinjePeriode } from '../../types/Utbetaling';
import { Rammebehandling } from '../rammebehandling/typer/Rammebehandling';
import { TidslinjeRammevedtak } from '../../types/TidslinjeRammevedtak';
import { Klagebehandling } from '../klage/typer/Klage';
import { Klagevedtak } from '../klage/typer/Klagevedtak';
import { Søknad } from '../../types/Søknad';
import { TilbakekrevingBehandling } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { MeldekortVedtak } from '~/lib/meldekort/typer/MeldekortVedtak';

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
    søknader: Søknad[];
    tilbakekrevinger: TilbakekrevingBehandling[];
    kanSendeInnHelgForMeldekort: boolean;
    meldekortvedtak: MeldekortVedtak[];
};
