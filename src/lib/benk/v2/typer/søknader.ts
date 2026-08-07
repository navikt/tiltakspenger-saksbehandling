import { Nullable } from '~/types/UtilTypes';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Request } from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkSøknadsbehandling = BenkV2BehandlingBase & {
    id: RammebehandlingId;
    status: BenkV2Behandlingsstatus;
    søknadstype: Søknadstype;
    kravtidspunkt: string;
    resultat: Nullable<SøknadsbehandlingResultat>;
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

export type BenkSøknaderRequest = BenkV2Request<BenkSøknaderFilter, BenkSøknaderKolonne>;
