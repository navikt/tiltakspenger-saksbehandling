import { ÅpenBehandling } from '../personoversikt/typer/ÅpenBehandling';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { UtbetalingstidslinjePeriode } from '~/types/Utbetaling';
import { Rammebehandling } from '../rammebehandling/typer/Rammebehandling';
import { TidslinjeRammevedtak } from '~/types/TidslinjeRammevedtak';
import { Klagebehandling } from '../klage/typer/Klage';
import { Klagevedtak } from '../klage/typer/Klagevedtak';
import { Søknad } from '~/types/Søknad';
import { TilbakekrevingBehandling } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { Nullable, PartialRecord } from '~/types/UtilTypes';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';

export type SakId = `sak_${string}`;

export type SakProps = {
    sakId: SakId;
    saksnummer: string;
    fnr: string;

    førsteDagSomGirRett?: string;
    sisteDagSomGirRett?: string;
    kanSendeInnHelgForMeldekort: boolean;

    søknader: Søknad[];

    åpneBehandlinger: ÅpenBehandling[];

    rammebehandlinger: Rammebehandling[];
    klagebehandlinger: Klagebehandling[];
    tilbakekrevinger: TilbakekrevingBehandling[];

    alleRammevedtak: Rammevedtak[];
    alleKlagevedtak: Klagevedtak[];

    meldekortvedtak: Meldekortvedtak[];
    meldekortbehandlinger: PartialRecord<MeldekortbehandlingId, MeldekortbehandlingProps>;
    meldeperiodeKjeder: MeldeperiodekjedeProps[];
    åpenMeldekortbehandlingId: Nullable<MeldekortbehandlingId>;

    tidslinje: TidslinjeRammevedtak;
    innvilgetTidslinje: TidslinjeRammevedtak;
    utbetalingstidslinje: UtbetalingstidslinjePeriode[];
};
