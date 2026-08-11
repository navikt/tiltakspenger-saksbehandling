import { Nullable } from '~/types/UtilTypes';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkBehandlingBase, BenkBehandlingsstatus, BenkBehandlingstype } from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkSøknadsbehandling = BenkBehandlingBase & {
    type: BenkBehandlingstype.SØKNADSBEHANDLING;
    id: RammebehandlingId;
    status: BenkBehandlingsstatus;
    søknadstype: Søknadstype;
    kravtidspunkt: string;
    resultat: Nullable<SøknadsbehandlingResultat>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export enum BenkSøknaderKolonne {
    fnr = 'fnr',
    søknadstype = 'søknadstype',
    status = 'status',
    kravtidspunkt = 'kravtidspunkt',
    resultat = 'resultat',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    ventestatusFrist = 'ventestatus_frist',
}

export type BenkSøknaderFilter = {
    status: Nullable<BenkBehandlingsstatus>;
    resultat: Nullable<SøknadsbehandlingResultat>;
    søknadstype: Nullable<Søknadstype>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};
