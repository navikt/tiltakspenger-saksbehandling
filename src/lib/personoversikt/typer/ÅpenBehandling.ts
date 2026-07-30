import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadId } from '~/types/Søknad';
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
export type ÅpenBehandlingId =
    | ÅpenSøknadId
    | ÅpenRammebehandlingId
    | ÅpenMeldekortbehandlingId
    | ÅpenKlagebehandlingId
    | ÅpenTilbakekrevingId;

export type ÅpenSøknadId = {
    id: SøknadId;
    type: ÅpenBehandlingType.SØKNAD;
};

export type ÅpenRammebehandlingId = {
    id: RammebehandlingId;
    type: ÅpenBehandlingType.SØKNADSBEHANDLING | ÅpenBehandlingType.REVURDERING;
};

export type ÅpenMeldekortbehandlingId = {
    id: MeldekortbehandlingId;
    type: ÅpenBehandlingType.MELDEKORT;
};

export type ÅpenKlagebehandlingId = {
    id: KlageId;
    type: ÅpenBehandlingType.KLAGE;
};

export type ÅpenTilbakekrevingId = {
    id: TilbakekrevingId;
    type: ÅpenBehandlingType.TILBAKEKREVING;
};
