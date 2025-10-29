import { Periode } from './Periode';
import { SakId } from './Sak';
import { BehandlingId, Rammebehandlingsstatus, RammebehandlingResultat } from './Behandling';
import { SøknadId } from './Søknad';
import { RevurderingResultat } from '~/types/Revurdering';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { Nullable } from '~/types/UtilTypes';

export type BehandlingEllerSøknadForOversikt = BehandlingForOversikt | SøknadForOversikt;

export enum TypeBehandlingForOversikt {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
    SØKNAD = 'SØKNAD',
}

interface BehandlingEllerSøknadForOversiktBase {
    id: BehandlingId | SøknadId;
    sakId: SakId;
    saksnummer: string;
    typeBehandling: TypeBehandlingForOversikt;
    opprettet: string; // LocalDateTime as ISO string
    periode?: Nullable<Periode>;
    status: Nullable<Rammebehandlingsstatus>;
    kravtidspunkt?: Nullable<string>; // LocalDateTime as ISO string
    underkjent?: Nullable<boolean>;
    resultat?: Nullable<RammebehandlingResultat>;
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
    erSattPåVent?: Nullable<boolean>;
}

interface BehandlingForOversiktBase extends BehandlingEllerSøknadForOversiktBase {
    id: BehandlingId;
    typeBehandling:
        | TypeBehandlingForOversikt.SØKNADSBEHANDLING
        | TypeBehandlingForOversikt.REVURDERING;
    status: Rammebehandlingsstatus;
    underkjent: boolean;
    kravtidspunkt: string | null;
    opprettet: string;
    resultat: RammebehandlingResultat;
    erSattPåVent: boolean;
}

interface SøknadsbehandlingForOversikt extends BehandlingForOversiktBase {
    typeBehandling: TypeBehandlingForOversikt.SØKNADSBEHANDLING;
    kravtidspunkt: string;
    resultat: SøknadsbehandlingResultat;
}

interface RevurderingForOversikt extends BehandlingForOversiktBase {
    typeBehandling: TypeBehandlingForOversikt.REVURDERING;
    kravtidspunkt: null;
    resultat: RevurderingResultat;
}

export type BehandlingForOversikt = SøknadsbehandlingForOversikt | RevurderingForOversikt;

export interface SøknadForOversikt extends BehandlingEllerSøknadForOversiktBase {
    id: SøknadId;
    typeBehandling: TypeBehandlingForOversikt.SØKNAD;
    periode: null;
    resultat: null;
    status: null;
    kravtidspunkt: string;
    underkjent: null;
    saksbehandler: null;
    beslutter: null;
    erSattPåVent: null;
}
