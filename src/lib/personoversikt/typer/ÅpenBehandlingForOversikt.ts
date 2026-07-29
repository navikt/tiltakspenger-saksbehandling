import { Periode } from '~/types/Periode';
import { SakId } from '../../sak/SakTyper';
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
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';

// Kan være:
// 1. Søknad uten opprettet behandling
// 2. Åpen rammebehandling (søknadsbehandling eller revurdering)
// 3. Åpen meldekortbehandling
// 4. Meldeperiodekjede med et brukers meldekort som ikke er behandlet
// 5. klage
export type ÅpenBehandlingForOversikt =
    | SøknadUtenBehandling
    | ÅpenSøknadsbehandling
    | ÅpenRevurdering
    | ÅpenMeldekortbehandling
    | BrukersMeldekortUtenBehandling
    | KlageBehandlingForOversikt;

export type ÅpenRammebehandlingForOversikt = ÅpenSøknadsbehandling | ÅpenRevurdering;

export enum ÅpenBehandlingForOversiktType {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
}

export enum ÅpentMeldekortSubType {
    MELDEKORTBEHANDLING = 'MELDEKORTBEHANDLING',
    INNSENDT_MELDEKORT = 'INNSENDT_MELDEKORT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
}

interface ÅpenBehandlingBase {
    id: SøknadId | RammebehandlingId | MeldeperiodeKjedeId | KlageId | MeldekortbehandlingId;
    sakId: SakId;
    saksnummer: string;
    opprettet: string;
    type: ÅpenBehandlingForOversiktType;
}

interface ÅpenRammebehandlingBase extends ÅpenBehandlingBase {
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
}

export interface SøknadUtenBehandling extends ÅpenBehandlingBase {
    id: SøknadId;
    type: ÅpenBehandlingForOversiktType.SØKNAD;
    kravtidspunkt: string;
}

export interface ÅpenSøknadsbehandling extends ÅpenRammebehandlingBase {
    type: ÅpenBehandlingForOversiktType.SØKNADSBEHANDLING;
    kravtidspunkt: string;
    resultat: SøknadsbehandlingResultat;
}

export interface ÅpenRevurdering extends ÅpenRammebehandlingBase {
    type: ÅpenBehandlingForOversiktType.REVURDERING;
    resultat: RevurderingResultat;
}

export interface ÅpenMeldekortbehandling extends ÅpenBehandlingBase {
    id: MeldekortbehandlingId;
    type: ÅpenBehandlingForOversiktType.MELDEKORT;
    subtype: ÅpentMeldekortSubType.MELDEKORTBEHANDLING;
    periode: Periode;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
}

export interface BrukersMeldekortUtenBehandling extends ÅpenBehandlingBase {
    id: MeldeperiodeKjedeId;
    type: ÅpenBehandlingForOversiktType.MELDEKORT;
    subtype: ÅpentMeldekortSubType.INNSENDT_MELDEKORT | ÅpentMeldekortSubType.KORRIGERT_MELDEKORT;
    periode: Periode;
}

export interface KlageBehandlingForOversikt extends ÅpenBehandlingBase {
    type: ÅpenBehandlingForOversiktType.KLAGE;
    saksbehandler: Nullable<string>;
    resultat: Nullable<KlagebehandlingResultat>;
    status: KlagebehandlingStatus;
}
