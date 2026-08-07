import { Nullable } from '~/types/UtilTypes';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Behandlingstype } from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkSøknadsbehandling = BenkV2BehandlingBase & {
    type: BenkV2Behandlingstype.SØKNADSBEHANDLING;
    id: RammebehandlingId;
    status: BenkV2Behandlingsstatus;
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
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
}

export type BenkSøknaderFilter = {
    status: Nullable<BenkV2Behandlingsstatus>;
    søknadstype: Nullable<Søknadstype>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};
