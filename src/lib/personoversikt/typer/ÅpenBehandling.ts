import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadId } from '~/lib/søknad/søknadTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { KlageId } from '~/lib/klage/typer/Klage';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';

export enum ÅpenBehandlingType {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

/**
 * Peker på en åpen behandling på saken. Selve behandlingen hentes fra saken med id og type.
 */
export type ÅpenBehandling =
    | ÅpenSøknad
    | ÅpenRammebehandling
    | ÅpenMeldekortbehandling
    | ÅpenKlagebehandling
    | ÅpenTilbakekreving;

export type ÅpenSøknad = {
    id: SøknadId;
    type: ÅpenBehandlingType.SØKNAD;
};

export type ÅpenRammebehandling = {
    id: RammebehandlingId;
    type: ÅpenBehandlingType.SØKNADSBEHANDLING | ÅpenBehandlingType.REVURDERING;
};

export type ÅpenMeldekortbehandling = {
    id: MeldekortbehandlingId;
    type: ÅpenBehandlingType.MELDEKORT;
};

export type ÅpenKlagebehandling = {
    id: KlageId;
    type: ÅpenBehandlingType.KLAGE;
};

export type ÅpenTilbakekreving = {
    id: TilbakekrevingId;
    type: ÅpenBehandlingType.TILBAKEKREVING;
};
