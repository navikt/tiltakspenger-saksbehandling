import { Periode } from '~/types/Periode';
import {
    RammebehandlingId,
    Rammebehandlingsstatus,
    RammebehandlingResultat,
} from '../../rammebehandling/typer/Rammebehandling';
import { SøknadId } from '~/types/Søknad';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { KlagebehandlingResultat, KlagebehandlingStatus, KlageId } from '../../klage/typer/Klage';
import {
    TilbakekrevingBehandlingsstatus,
    TilbakekrevingId,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';

// Kan være:
// 1. Søknad uten opprettet behandling
// 2. Åpen rammebehandling (søknadsbehandling eller revurdering)
// 3. Åpen meldekortbehandling
// 4. klage
// 5. Åpen tilbakekreving
export type ÅpenBehandlingForOversikt =
    | SøknadUtenBehandling
    | ÅpenSøknadsbehandling
    | ÅpenRevurdering
    | ÅpenMeldekortbehandling
    | KlageBehandlingForOversikt
    | ÅpenTilbakekreving;

export type ÅpenRammebehandlingForOversikt = ÅpenSøknadsbehandling | ÅpenRevurdering;

export enum ÅpenBehandlingForOversiktType {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

type ÅpenBehandlingBase = {
    id: SøknadId | RammebehandlingId | KlageId | MeldekortbehandlingId | TilbakekrevingId;
    opprettet: string;
    type: ÅpenBehandlingForOversiktType;
};

type ÅpenRammebehandlingBase = ÅpenBehandlingBase & {
    id: RammebehandlingId;
    type:
        | ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING
        | ÅpenBehandlingForOversiktType.REVURDERING;
    resultat: RammebehandlingResultat;
    status: Rammebehandlingsstatus;
    periode: Nullable<Periode>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    underkjent: boolean;
    erSattPåVent: boolean;
};

export type SøknadUtenBehandling = ÅpenBehandlingBase & {
    id: SøknadId;
    type: ÅpenBehandlingForOversiktType.SØKNAD;
    kravtidspunkt: string;
};

export type ÅpenSøknadsbehandling = ÅpenRammebehandlingBase & {
    type: ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING;
    kravtidspunkt: string;
    resultat: SøknadsbehandlingResultat;
};

export type ÅpenRevurdering = ÅpenRammebehandlingBase & {
    type: ÅpenBehandlingForOversiktType.REVURDERING;
    resultat: RevurderingResultat;
};

export type ÅpenMeldekortbehandling = ÅpenBehandlingBase & {
    id: MeldekortbehandlingId;
    type: ÅpenBehandlingForOversiktType.MELDEKORT;
    periode: Periode;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
};

export type KlageBehandlingForOversikt = ÅpenBehandlingBase & {
    type: ÅpenBehandlingForOversiktType.KLAGE;
    saksbehandler: Nullable<string>;
    resultat: Nullable<KlagebehandlingResultat>;
    status: KlagebehandlingStatus;
};

export type ÅpenTilbakekreving = ÅpenBehandlingBase & {
    id: TilbakekrevingId;
    type: ÅpenBehandlingForOversiktType.TILBAKEKREVING;
    periode: Periode;
    status: TilbakekrevingBehandlingsstatus;
    totaltFeilutbetaltBeløp: number;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
};
