import { Periode } from './Periode';
import { SakId } from './Sak';
import { BehandlingId, Rammebehandlingsstatus, RammebehandlingResultat } from './Rammebehandling';
import { SøknadId } from './Søknad';
import { RevurderingResultat } from '~/types/Revurdering';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { Nullable } from '~/types/UtilTypes';
import { MeldeperiodeKjedeId, MeldeperiodeKjedeStatus } from '~/types/meldekort/Meldeperiode';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { KlagebehandlingResultat, KlagebehandlingStatus, KlageId } from './Klage';

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
    | MeldeperiodeKjedeSomMåBehandles
    | KlageBehandlingForOversikt;

export type ÅpenRammebehandlingForOversikt = ÅpenSøknadsbehandling | ÅpenRevurdering;

export enum ÅpenBehandlingForOversiktType {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
}

interface ÅpenBehandlingBase {
    id: SøknadId | BehandlingId | MeldeperiodeKjedeId | KlageId;
    sakId: SakId;
    saksnummer: string;
    opprettet: string;
    type: ÅpenBehandlingForOversiktType;
}

interface ÅpenRammebehandlingBase extends ÅpenBehandlingBase {
    id: BehandlingId;
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

export interface MeldeperiodeKjedeSomMåBehandles extends ÅpenBehandlingBase {
    id: MeldeperiodeKjedeId;
    // Definert dersom det er en åpen meldekortbehandling på kjeden
    meldekortBehandlingId: Nullable<MeldekortBehandlingId>;
    type: ÅpenBehandlingForOversiktType.MELDEKORT;
    periode: Periode;
    status: MeldeperiodeKjedeStatus;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
}

export interface KlageBehandlingForOversikt extends ÅpenBehandlingBase {
    type: ÅpenBehandlingForOversiktType.KLAGE;
    saksbehandler: Nullable<string>;
    resultat: Nullable<KlagebehandlingResultat>;
    status: KlagebehandlingStatus;
}
