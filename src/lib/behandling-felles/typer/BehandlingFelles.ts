import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    Rammebehandling,
    RammebehandlingId,
    Rammebehandlingsstatus,
} from '../../rammebehandling/typer/Rammebehandling';
import { Rammevedtak, RammevedtakMedBehandling } from '~/lib/rammebehandling/typer/Rammevedtak';
import { KlagevedtakMedBehandling } from '~/lib/klage/typer/Klagevedtak';
import { Meldekortvedtak } from '~/lib/meldekort/typer/Meldekortvedtak';

export type BehandlingId = RammebehandlingId | MeldekortbehandlingId;

export type BehandlingProps = Rammebehandling | MeldekortbehandlingProps;

export type Behandlingsstatus = Rammebehandlingsstatus | MeldekortbehandlingStatus;

export type Vedtak = Rammevedtak | Meldekortvedtak;

export enum VedtakType {
    Rammebehandling = 'Rammebehandling',
    Meldekort = 'Meldekort',
    Klage = 'Klage',
}

export type RammevedtakEllerKlageMedBehandling =
    | RammevedtakMedBehandling
    | KlagevedtakMedBehandling;

/**
 * Sidene en behandlingsmeny kan kalles fra. Styrer om handlingene i menyen navigerer,
 * eller oppdaterer saken vi allerede står i.
 */
export type BehandlingsmenyKallesFra = 'personoversikt' | 'behandling';

export enum SaksbehandlerBehandlingKommando {
    TildelSaksbehandler = 'TildelSaksbehandler',
    TildelBeslutter = 'TildelBeslutter',
    OvertaSaksbehandler = 'OvertaSaksbehandler',
    OvertaBeslutter = 'OvertaBeslutter',
    LeggTilbakeSaksbehandler = 'LeggTilbakeSaksbehandler',
    LeggTilbakeBeslutter = 'LeggTilbakeBeslutter',
    SettPåVent = 'SettPåVent',
    Gjenoppta = 'Gjenoppta',
    Avbryt = 'Avbryt',
}
